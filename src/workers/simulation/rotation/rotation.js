import { MISC } from '@/data';
import { matchIfInflict, matchUseOn, matchRemoveOn, matchUseIf, matchRemoveIf, matchApplyIf } from '../match';
import { createCdTracker, isOnCooldown, setCooldown, advanceCooldowns } from './cooldowns';
import { buildFootprint, evaluateFootprint } from './footprint';
import { getFormulaConfig } from './formula';

const MAX_PROC_DEPTH = 5;

function removeEffects(ctx, action) {
  const { memberState, fieldState } = ctx;

  for (const state of [
    ...Object.values(memberState),
    fieldState.active,
    fieldState.inactive,
  ]) {
    for (const effectKey in state) {
      const { effect } = state[effectKey];
      if (effect.ownerId !== action.ownerId) continue;

      if (matchRemoveOn(action, effect) || matchRemoveIf(action, effect, ctx)) {
        delete state[effectKey];
      }
    }
  }
}

function applyEffect(effectStates, effect, applyTimes) {
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

function applyStatus(stateMap, status, stacks) {
  const tracker = stateMap[status.id];

  if (!tracker) {
    stateMap[status.id] = {
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

  const triggered = cache.effect[action.key].filter(effect => effect.applyWhen === trigger);
  const inflictedStatuses = {};

  for (const effect of triggered) {
    if ('applyIfInflict' in effect) continue;
    if (isOnCooldown(ctx, 'apply', effect.key)) continue;
    if (!matchApplyIf(action, effect, ctx)) continue;

    for (const target of effect.applyTo) {
      if (target in cache.member) {
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

            inflictedStatuses[statusId] ??= 0;
            inflictedStatuses[statusId] += stacks;
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

// Advances (and expires) all active effects by the action's timing window.
// `offset` is used to check expiry (effects expiring before the action mid-point
// are gone), while `duration` is the full advance applied to survivors.
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
  const { status: statusState } = enemyState;

  const { STATUSES = {} } = MISC[cache.gameId];

  for (const statusId in statusState) {
    const tracker = statusState[statusId];
    const status = STATUSES[statusId];
    let timer = elapsed;

    while (timer > 0) {
      const decrease = Math.min(tracker.duration, tracker.tickTimer, timer);

      tracker.duration -= decrease;
      tracker.tickTimer -= decrease;
      timer -= decrease;

      if (tracker.duration <= 0) {
        if ('reapply' in status) {
          tracker.duration = status.duration;
          tracker.stacks--;

          if (tracker.stacks <= 0) {
            delete statusState[statusId];
            break;
          }
        } else {
          delete statusState[statusId];
          break;
        }
      }

      if (tracker.tickTimer <= 0) {
        // damage footprint function goes here
        tracker.tickTimer = status.tickInterval;
      }
    }
  }
}

// Decrements `usesRemaining` for all effects that triggered and removes effects that have exhausted their remaining uses.
function decayProcCounts(ctx, action) {
  for (const stateMap of [
    ...Object.values(ctx.memberState),
    ...Object.values(ctx.fieldState),
    ctx.enemyState.stat,
  ]) {
    for (const effectKey in stateMap) {
      const state = stateMap[effectKey];

      if (state.usesRemaining === Infinity) continue;
      if (state.effect.followUpAction || state.effect.intervalAction) continue;
      if (!matchUseOn(action, state.effect) || !matchUseIf(action, state.effect, ctx)) continue;

      state.usesRemaining -= 1;

      if (state.usesRemaining <= 0) {
        delete stateMap[effectKey];
      }
    }
  }
}

function processFollowUpActions(action, ctx, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { onFieldId, memberState, fieldState } = ctx;
  const actionOwnerState = onFieldId === action.ownerId ? 'active' : 'inactive';

  for (const state of [
    memberState[action.ownerId],
    fieldState[actionOwnerState],
  ]) {
    for (const [effectKey, tracker] of Object.entries(state)) {
      const { effect } = tracker;
      if (!('followUpAction' in effect) || isOnCooldown(ctx, 'use', effectKey)) continue;
      if (!matchUseOn(action, effect) || !matchUseIf(action, effect, ctx)) continue;

      if (effect.useCooldown) {
        setCooldown(ctx, 'use', effectKey, effect.useCooldown);
      }

      tracker.usesRemaining--;
      if (tracker.usesRemaining <= 0) {
        delete state[effectKey];
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
    const state = memberState[memberId];

    for (const [effectKey, tracker] of Object.entries(state)) {
      const { effect } = tracker;
      if (!('intervalAction' in effect)) continue;

      tracker.intervalTimer -= elapsed;
      while (tracker.intervalTimer <= 0) {
        tracker.usesRemaining--;

        if (tracker.usesRemaining <= 0) {
          delete state[effectKey];
        }

        for (const action of effect.intervalAction) {
          processAction(ctx, action, depth + 1,effect.times);
        }

        tracker.intervalTimer += effect.intervalCooldown;
      }
    }
  }
}

function processTopLevelAction(ctx, action) {
  const { duration, offset } = action;
  const remaining = duration - offset;

  // ── Cast (t = 0) ───────────────────────────────────────────────────
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // ── Pre-hit window (t = 0 → offset) ───────────────────────────
  advanceEffectStates(ctx, offset);
  tickStatuses(ctx, offset);
  processIntervalActions(ctx, offset, 0);
  advanceCooldowns(ctx, offset);

  // ── Contact (t = offset) ───────────────────────────────────────────
  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action);
    ctx.footprints.push(footprint);
  }

  applyEffects(ctx, action, 'hit');

  // ── Post-hit window (t = offset → end) ─────────────────────────
  // Contact effects are now in the tracker, so this one call handles them too
  advanceEffectStates(ctx, remaining);
  tickStatuses(ctx, remaining);
  processIntervalActions(ctx, remaining, 0);
  advanceCooldowns(ctx, remaining);

  // ── Follow-ups + cleanup ───────────────────────────────────────────
  processFollowUpActions(action, ctx, 0);
  decayProcCounts(ctx, action);
}

function processProcAction(ctx, action, depth, repeatCount) {
  applyEffects(ctx, action, 'cast', repeatCount);

  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action, repeatCount);
    ctx.footprints.push(footprint);
  }

  applyEffects(ctx, action, 'hit', repeatCount);
  processFollowUpActions(action, ctx, depth);
}

function processAction(ctx, action, depth, repeatCount = 1) {
  if (depth >= MAX_PROC_DEPTH) {
    console.log("MAX_PROC_DEPTH hit");
    return;
  }

  if (depth === 0) {
    processTopLevelAction(ctx, action);
  } else {
    processProcAction(ctx, action, depth, repeatCount);
  }
}

export const compileRotation = (cache, currId, team) => {
  // Setup context
  const equipMapByMember = {};
  const memberState = {};

  for (const member of team) {
    equipMapByMember[member.id] = member.equipMap;
    memberState[member.id] = {};
  }

  const formulaConfig = getFormulaConfig(cache.gameId);

  const ctx = {
    cache,
    currId,
    onFieldId: null,
    equipMapByMember,
    memberState,
    fieldState: { active: {}, inactive: {} },
    enemyState: { stat: {}, status: {} },
    cooldowns: createCdTracker(),
    recordFootprint: false,
    footprints: [],
    formulaConfig,
  };

  // Main Processing loop
  // Priming pass
  for (const member of team.toReversed()) {
    const { rotation } = cache.member[member.id];
    ctx.onFieldId = member.id;

    for (const action of rotation) {
      processAction(ctx, action, 0);
    }
  }

  // Damage pass
  ctx.recordFootprint = true;

  for (const member of team.toReversed()) {
    const { rotation } = cache.member[member.id];
    ctx.onFieldId = member.id;

    for (const action of rotation) {
      processAction(ctx, action, 0);
    }
  }

  return { currId, footprints: ctx.footprints, formulaConfig };
};

export const evaluateRotation = (compiledRotation, statMap) => {
  const { currId, footprints, formulaConfig } = compiledRotation;
  const ctx = { currId, formulaConfig };
  const summary = {};

  for (const footprint of footprints) {
    const result = evaluateFootprint(ctx, footprint, statMap);

    if (result.key in summary) {
      const existing = summary[result.key];
      existing[result.type] += result[result.type];
    } else {
      summary[result.key] = result;
    }
  }

  return summary;
};
