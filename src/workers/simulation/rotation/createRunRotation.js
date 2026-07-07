import { MISC } from '@/data';
import { matchIfInflict, matchUseOn, matchUseIf, matchApplyIf } from '../match';
import { isOnCooldown, setCooldown, advanceCooldowns } from './cooldowns';
import { buildFootprint, evaluateFootprint } from './footprint';
import { formulaConfig as getFormulaConfig } from '../config';
import { applyTune, advanceTune } from './offtune';
import { createEffectStateMaps, applyEffect, removeEffects, advanceEffects } from './effects';
import { buildStatusFootprint, applyStatus } from './negativeStatuses';

const MAX_PROC_DEPTH = 5;

function applyEffects(ctx, action, trigger, repeat = 1) {
  const { cache, state } = ctx;

  if (!(action.key in cache.effect)) return;

  const triggered = cache.effect[action.key].filter((effect) => effect.applyWhen === trigger);
  const inflictedStatuses = new Set();

  for (const effect of triggered) {
    if ('applyIfInflict' in effect) continue;
    if (isOnCooldown(ctx, 'apply', effect.key)) continue;
    if (!matchApplyIf(action, effect, ctx)) continue;

    for (const target of effect.applyTo) {
      if (target === 'applier') {
        applyEffect(state.effects[action.ownerId], effect, repeat);
      } else if (target in cache.member) {
        applyEffect(state.effects[target], effect, repeat);
      } else if (target === 'active' || target === 'inactive') {
        applyEffect(state.fieldEffects[target], effect, repeat);
      } else {
        if ('statMap' in effect) {
          applyEffect(state.debuffs, effect, repeat);
        }

        if ('statusMap' in effect) {
          const { STATUSES = {} } = MISC[cache.gameId];

          for (const statusId in effect.statusMap) {
            const status = STATUSES[statusId];
            const stacks = effect.statusMap[statusId] * repeat;

            applyStatus(state.negativeStatuses, status, stacks)

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
        applyEffect(state.fieldEffects[target], effect, repeat);
      } else if (target === 'enemy' && 'statMap' in effect) {
        applyEffect(state.debuffs, effect, repeat);
      } else {
        applyEffect(state.effects[target], effect, repeat);
      }
    }

    if ('applyCooldown' in effect) {
      setCooldown(ctx, 'apply', effect.key, effect.applyCooldown);
    }
  }
}

function tickStatuses(ctx, elapsed) {
  const { cache, state } = ctx;
  const { negativeStatuses: statusStates } = state;

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
    ...Object.values(ctx.state.effects),
    ...Object.values(ctx.state.fieldEffects),
    ctx.state.debuffs,
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

  const { onFieldId, state } = ctx;
  const actionOwnerState = onFieldId === action.ownerId ? 'active' : 'inactive';

  const effectStores = [
    state.effects[action.ownerId],
    state.fieldEffects[actionOwnerState],
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
  const { state } = ctx;

  for (const memberId in state.effects) {
    const effectStates = state.effects[memberId];

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

  // Cast (t = 0)
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // Pre-hit window (t = 0 → offset)
  advanceEffects(ctx, offset);
  tickStatuses(ctx, offset);
  processIntervalActions(ctx, offset, 0);
  advanceCooldowns(ctx, offset);

  // Hits (each spaced hitInterval apart)
  for (let i = 0; i < hitCount; i++) {
    // Contact
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

    // Inter-hit window
    advanceTune(ctx, hitInterval);
    advanceEffects(ctx, hitInterval);
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

export const createRunRotation = (cache, equipMaps, currId) => {
  const formulaConfig = getFormulaConfig[cache.gameId];

  // Runtime state
  const state = {
    cooldowns: { apply: {}, use: {} },
    effects: createEffectStateMaps(cache.memberIds),
    fieldEffects: { active: {}, inactive: {} },
    debuffs: {},
    negativeStatuses: {},
    offTune: { level: 0 },
  };

  const ctx = {
    cache,
    currId,
    equipMaps,
    state,
    footprints: [],
    formulaConfig,
  };

  const memberOrder = cache.memberIds.toReversed();

  for (const memberId of memberOrder) {
    const { rotation } = cache.member[memberId];
    ctx.onFieldId = memberId;

    for (const action of rotation) {
      processAction(ctx, action, 0);
    }
  }

  ctx.recordFootprint = true;

  for (const memberId of memberOrder) {
    const { rotation } = cache.member[memberId];
    ctx.onFieldId = memberId;

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
