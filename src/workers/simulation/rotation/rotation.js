import { MISC } from '@/data';
import { matchIfInflict, matchUseOn, matchRemoveOn, matchUseIf, matchRemoveIf, matchApplyIf } from '../match';
import { createCdTracker, isOnCooldown, setCooldown, advanceCooldowns } from './cooldowns';
import { buildFootprint, evaluateFootprint } from './footprint';
import { formulaConfig as getFormulaConfig } from '../config';
import { buildStatusFootprint } from './status';
import { applyTune, advanceTune } from './offtune';

const MAX_PROC_DEPTH = 5;

function removeEffects(ctx, action) {
  const { memberState, fieldState } = ctx;

  for (const effectStates of [
    ...Object.values(memberState),
    fieldState.active,
    fieldState.inactive,
  ]) {
    for (const effectKey in effectStates) {
      const { effect } = effectStates[effectKey];
      if (effect.ownerId !== action.ownerId) continue;

      if (matchRemoveOn(action, effect) || matchRemoveIf(action, effect, ctx)) {
        delete effectStates[effectKey];
      }
    }
  }
}

export function applyEffect(effectStates, effect, applyTimes) {
  const { intervalOffset } = effect;
  const prev = effectStates[effect.key] ?? {};
  const existingStacks = prev.stacks ?? 0;

  const next = {
    stacks: Math.min(existingStacks + applyTimes, effect.maxStacks),
    timeRemaining: effect.duration,
    usesRemaining: effect.maxUses,
    effect,
  };

  if ('intervalCooldown' in effect) {
    const existingEffectTimer = prev.intervalTimer;
    next.intervalTimer ??= existingEffectTimer ?? intervalOffset;
  }

  effectStates[effect.key] = next;
}

function applyStatus(statusStates, status, stacks) {
  const tracker = statusStates[status.id];

  if (!tracker) {
    statusStates[status.id] = {
      stacks: Math.min(stacks, status.maxStacks),
      tickTimer: status.tickInterval,
      duration: status.duration,
    };
  } else {
    tracker.stacks = Math.min(tracker.stacks + stacks, status.maxStacks);
    tracker.duration = status.duration;
  }
}

function applyEffects(ctx, action, trigger, repeat = 1) {
  const { cache, memberState, fieldState, enemyState } = ctx;

  if (!(action.key in cache.effect)) return;

  const triggered = cache.effect[action.key].filter((effect) => effect.applyWhen === trigger);
  const inflictedStatuses = new Set();

  for (const effect of triggered) {
    if ('applyIfInflict' in effect) continue;
    if (isOnCooldown(ctx, 'apply', effect.key)) continue;
    if (!matchApplyIf(action, effect, ctx)) continue;

    for (const target of effect.applyTo) {
      if (target === 'applier') {
        applyEffect(memberState[action.ownerId], effect, repeat);
      } else if (target in cache.member) {
        applyEffect(memberState[target], effect, repeat);
      } else if (target === 'active' || target === 'inactive') {
        applyEffect(fieldState[target], effect, repeat);
      } else {
        if ('statMap' in effect) {
          applyEffect(enemyState.stat, effect, repeat);
        }

        if ('statusMap' in effect) {
          const { STATUSES = {} } = MISC[cache.gameId];

          for (const statusId in effect.statusMap) {
            const status = STATUSES[statusId];
            const stacks = effect.statusMap[statusId] * repeat;

            applyStatus(enemyState.status, status, stacks)

            inflictedStatuses.add(statusId);
          }
        }
      }
    }

    if (effect.applyCooldown) {
      setCooldown(ctx, 'apply', effect.key, effect.applyCooldown);
    }
  }

  for (const effect of triggered) {
    if (!('applyIfInflict' in effect)) continue;
    if (isOnCooldown(ctx, 'apply', effect.key)) continue;
    if (!matchIfInflict(effect.applyIfInflict, inflictedStatuses)) continue;

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(fieldState[target], effect, repeat);
      } else if (target === 'enemy' && 'statMap' in effect) {
        applyEffect(enemyState.stat, effect, repeat);
      } else {
        applyEffect(memberState[target], effect, repeat);
      }
    }

    if ('applyCooldown' in effect) {
      setCooldown(ctx, 'apply', effect.key, effect.applyCooldown);
    }
  }
}

function advanceEffectStates(ctx, elapsed) {
  const { memberState, fieldState, enemyState } = ctx;

  const effectStores = [
    ...Object.values(memberState),
    fieldState.active,
    fieldState.inactive,
    enemyState.stat,
  ];

  for (const effectStates of effectStores) {
    for (const effectKey in effectStates) {
      const effectState = effectStates[effectKey];

      effectState.timeRemaining -= elapsed;

      if (effectState.timeRemaining <= 0) {
        delete effectStates[effectKey];
      }
    }
  }
}

function tickStatuses(ctx, elapsed) {
  const { cache, enemyState } = ctx;
  const { status: statusStates } = enemyState;

  const { STATUSES = {} } = MISC[cache.gameId];

  for (const statusId in statusStates) {
    const statusState = statusStates[statusId];
    const status = STATUSES[statusId];
    let timer = elapsed;

    while (timer > 0) {
      const decrease = Math.min(statusState.duration, statusState.tickTimer, timer);

      statusState.duration -= decrease;
      statusState.tickTimer -= decrease;
      timer -= decrease;

      if (statusState.duration <= 0) {
        if ('reapply' in status) {
          statusState.duration = status.duration;
          statusState.stacks--;

          if (statusState.stacks <= 0) {
            delete statusStates[statusId];
            break;
          }
        } else {
          delete statusStates[statusId];
          break;
        }
      }

      if (statusState.tickTimer <= 0) {
        if (ctx.recordFootprint) {
          const footprint = buildStatusFootprint(ctx, statusId, statusState.stacks);
          ctx.footprints.push(footprint);
        }

        statusState.tickTimer = status.tickInterval;
      }
    }
  }
}

function decayProcCounts(ctx, action) {
  for (const effectStates of [
    ...Object.values(ctx.memberState),
    ...Object.values(ctx.fieldState),
    ctx.enemyState.stat,
  ]) {
    for (const effectKey in effectStates) {
      const effectState = effectStates[effectKey];

      if (effectState.usesRemaining === Infinity) continue;
      if ('followUpAction' in effectState.effect || 'intervalAction' in effectState.effect) continue;
      if (!matchUseOn(effectState.effect, action) || !matchUseIf(effectState.effect, action.ownerId, ctx)) continue;

      effectState.usesRemaining -= 1;

      if (effectState.usesRemaining <= 0) {
        delete effectStates[effectKey];
      }
    }
  }
}

function processFollowUpActions(ctx, action, depth) {
  if (depth >= MAX_PROC_DEPTH) return;

  const { onFieldId, memberState, fieldState } = ctx;
  const actionOwnerState = onFieldId === action.ownerId ? 'active' : 'inactive';

  const effectStores = [
    memberState[action.ownerId],
    fieldState[actionOwnerState],
  ];

  for (const effectStates of effectStores) {
    for (const [effectKey, effectState] of Object.entries(effectStates)) {
      const { effect } = effectState;
      if (!('followUpAction' in effect) || isOnCooldown(ctx, 'use', effectKey)) continue;
      if (!matchUseOn(effect, action) || !matchUseIf(effect, action.ownerId, ctx)) continue;

      if ('useCooldown' in effect) {
        setCooldown(ctx, 'use', effectKey, effect.useCooldown);
      }

      effectState.usesRemaining--;
      if (effectState.usesRemaining <= 0) {
        delete effectStates[effectKey];
      }

      for (const action of effect.followUpAction) {
        processAction(ctx, action, depth + 1, effect.times);
      }
    }
  }
}

function processIntervalActions(ctx, elapsed, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { memberState } = ctx;

  for (const memberId in memberState) {
    const effectStates = memberState[memberId];

    for (const [effectKey, effectState] of Object.entries(effectStates)) {
      const { effect } = effectState;
      if (!('intervalAction' in effect)) continue;

      effectState.intervalTimer -= elapsed;
      while (effectState.intervalTimer <= 0) {
        effectState.usesRemaining--;

        if (effectState.usesRemaining <= 0) {
          delete effectStates[effectKey];
        }

        for (const action of effect.intervalAction) {
          processAction(ctx, action, depth + 1, effect.times);
        }

        effectState.intervalTimer += effect.intervalCooldown;
      }
    }
  }
}

function getHitCount(action) {
  const { compressed } = action;
  if (!compressed) return 1;

  let maxHits = 1;
  for (const element in compressed) {
    const { hits } = compressed[element];
    if (hits > maxHits) maxHits = hits;
  }
  return maxHits;
}

function processTopLevelAction(ctx, action) {
  const { duration, offset } = action;
  const remaining = duration - offset;
  const hitCount = getHitCount(action);
  const hitInterval = remaining / hitCount;

  // ── Cast (t = 0) ───────────────────────────────────────────────────
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // ── Pre-hit window (t = 0 → offset) ───────────────────────────
  advanceEffectStates(ctx, offset);
  tickStatuses(ctx, offset);
  processIntervalActions(ctx, offset, 0);
  advanceCooldowns(ctx, offset);

  // ── Hits (each spaced hitInterval apart) ────────────────────────────
  for (let i = 0; i < hitCount; i++) {
    // ── Contact ─────────────────────────────────────────────────────
    if (ctx.recordFootprint) {
      const footprint = buildFootprint(ctx, action);
      ctx.footprints.push(footprint);
    }

    if (action.type === 'damage') {
      applyTune(ctx, action);
    }
    applyEffects(ctx, action, 'hit');
    processFollowUpActions(ctx, action, 0);
    decayProcCounts(ctx, action);

    // ── Inter-hit window ─────────────────────────────────────────────
    advanceTune(ctx, hitInterval);
    advanceEffectStates(ctx, hitInterval);
    tickStatuses(ctx, hitInterval);
    processIntervalActions(ctx, hitInterval, 0);
    advanceCooldowns(ctx, hitInterval);
  }
}

function processProcAction(ctx, action, depth, repeatCount) {
  applyEffects(ctx, action, 'cast', repeatCount);

  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action, repeatCount);
    ctx.footprints.push(footprint);
  }

  if (action.type === 'damage') {
    applyTune(ctx, action);
  }

  applyEffects(ctx, action, 'hit', repeatCount);
  processFollowUpActions(ctx, action, depth);
}

function processAction(ctx, action, depth, repeatCount = 1) {
  if (depth >= MAX_PROC_DEPTH) {
    console.error("MAX_PROC_DEPTH hit");
    return;
  }

  if (depth === 0) {
    processTopLevelAction(ctx, action);
  } else {
    processProcAction(ctx, action, depth, repeatCount);
  }
}

export const createRunRotation = (cache, currId, team) => {
  const equipMapByMember = {};
  const memberState = {};

  for (const member of team) {
    equipMapByMember[member.id] = member.equipMap;
    memberState[member.id] = {};
  }

  const formulaConfig = getFormulaConfig[cache.gameId];

  const ctx = {
    cache,
    currId,
    onFieldId: null,
    equipMapByMember,
    memberState,
    fieldState: { active: {}, inactive: {} },
    enemyState: { stat: {}, status: {} },
    offTuneState: { level: 0 },
    cooldowns: createCdTracker(),
    recordFootprint: false,
    footprints: [],
    formulaConfig,
  };

  for (const member of team.toReversed()) {
    const { rotation } = cache.member[member.id];
    ctx.onFieldId = member.id;

    for (const action of rotation) {
      processAction(ctx, action, 0);
    }
  }

  ctx.recordFootprint = true;

  for (const member of team.toReversed()) {
    const { rotation } = cache.member[member.id];
    ctx.onFieldId = member.id;

    for (const action of rotation) {
      processAction(ctx, action, 0);
    }
  }

  const earlySummary = {};
  for (const footprint of ctx.footprints) {
    if (!('fixed' in footprint)) continue;

    if (footprint.key in earlySummary) {
      earlySummary[footprint.key][footprint.type] += footprint.fixed;
    } else {
      earlySummary[footprint.key] = {
        key: footprint.key,
        ownerId: footprint.ownerId,
        type: footprint.type,
        dmgType: footprint.dmgType,
        [footprint.type]: footprint.fixed,
      };
    }
  }

  ctx.footprints = ctx.footprints.filter((footprint) => !('fixed' in footprint));

  return (statMap) => {
    const ctx2 = { currId, formulaConfig };
    const summary = { ...earlySummary };

    for (const footprint of ctx.footprints) {
      const result = evaluateFootprint(ctx2, footprint, statMap);

      if (result.key in summary) {
        summary[result.key][result.type] += result[result.type];
      } else {
        summary[result.key] = result;
      }
    }

    return summary;
  };
};
