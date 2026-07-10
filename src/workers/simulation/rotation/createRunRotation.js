import { matchIfInflict, matchUseOn, matchUseIf, matchApplyIf } from '../match';
import { isOnCooldown, setCooldown, advanceCooldowns } from './cooldowns';
import { buildFootprint, evaluateFootprint } from './footprint';
import { applyTune, advanceTune } from './offtune';
import { applyEffect, removeEffects, advanceEffects } from './effects';
import { inflictNegativeStatuses, advanceNegativeStatuses } from './negativeStatuses';

const MAX_PROC_DEPTH = 5;

function applyEffects(ctx, action, trigger) {
  const { cache, state } = ctx;

  if (!(action.key in cache.effect)) return;

  const triggered = cache.effect[action.key].filter((effect) => effect.applyWhen === trigger);
  const inflictedStatuses = {};
  if ('inflict' in action && trigger === 'hit') {
    inflictNegativeStatuses(ctx, action.inflict);
    Object.assign(inflictedStatuses, action.inflict);
  }

  for (const effect of triggered) {
    if ('applyIfInflict' in effect) continue;
    if (isOnCooldown(state.cooldowns, 'apply', effect.key)) continue;
    if (!matchApplyIf(action, effect, ctx)) continue;

    for (const target of effect.applyTo) {
      if (target === 'applier') {
        applyEffect(state.effects[action.ownerId], effect);
      } else if (target in cache.member) {
        applyEffect(state.effects[target], effect);
      } else if (target === 'active' || target === 'inactive') {
        applyEffect(state.fieldEffects[target], effect);
      } else {
        if ('statMap' in effect) {
          applyEffect(state.debuffs, effect);
        }

        if ('inflict' in effect) {
          inflictNegativeStatuses(ctx, effect.inflict);
          Object.assign(inflictedStatuses, effect.inflict);
        }
      }
    }

    if (effect.applyCooldown) {
      setCooldown(state.cooldowns, 'apply', effect.key, effect.applyCooldown);
    }
  }

  for (const effect of triggered) {
    if (!('applyIfInflict' in effect)) continue;
    if (isOnCooldown(state.cooldowns, 'apply', effect.key)) continue;
    if (!matchIfInflict(effect.applyIfInflict, Object.keys(inflictedStatuses))) continue;

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(state.fieldEffects[target], effect);
      } else if (target === 'enemy' && 'statMap' in effect) {
        applyEffect(state.debuffs, effect);
      } else {
        applyEffect(state.effects[target], effect);
      }
    }

    if ('applyCooldown' in effect) {
      setCooldown(state.cooldowns, 'apply', effect.key, effect.applyCooldown);
    }
  }
}

function decayProcCounts(ctx, action) {
  const { effects, fieldEffects, debuffs } = ctx.state;

  const stateMaps = [
    ...Object.values(effects),
    ...Object.values(fieldEffects),
    debuffs,
  ];

  for (const stateMap of stateMaps) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      if ('followUpAction' in effectState.effect || 'intervalAction' in effectState.effect) continue;
      if (!matchUseOn(effectState.effect, action) || !matchUseIf(effectState.effect, action.ownerId, ctx)) continue;

      effectState.usesRemaining -= 1;

      if (effectState.usesRemaining <= 0) {
        delete stateMap[key];
      }
    }
  }
}

function executeFollowUpActions(ctx, action, depth) {
  const { effects, fieldEffects, cooldowns } = ctx.state;
  const actionOwnerField = ctx.onFieldId === action.ownerId ? 'active' : 'inactive';

  const stateMaps = [
    effects[action.ownerId],
    fieldEffects[actionOwnerField],
  ];

  for (const stateMap of stateMaps) {
    for (const [effectKey, effectState] of Object.entries(stateMap)) {
      if (effectState.executing) continue;
      const { effect } = effectState;
      if (!('followUpAction' in effect) || isOnCooldown(cooldowns, 'use', effectKey)) continue;
      if (!matchUseOn(effect, action) || !matchUseIf(effect, action.ownerId, ctx)) continue;

      effectState.executing = true;
      for (const action of effect.followUpAction) {
        for (let i = 0; i < effect.times; i ++) {
          executeAction(ctx, action, depth + 1);
        }
      }
      effectState.executing = false;

      if ('useCooldown' in effect) {
        setCooldown(cooldowns, 'use', effectKey, effect.useCooldown);
      }

      effectState.usesRemaining--;
      if (effectState.usesRemaining <= 0) {
        delete stateMap[effectKey];
        delete cooldowns.use[effectKey];
      }
    }
  }
}

function executeIntervalActions(ctx, elapsed, depth) {
  const { effects } = ctx.state;

  for (const stateMap of Object.values(effects)) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      const { effect } = effectState;
      if (!('intervalAction' in effect)) continue;

      effectState.intervalTimer -= elapsed;
      while (effectState.intervalTimer <= 0) {
        for (const action of effect.intervalAction) {
          for (let i = 0; i < effect.times; i ++) {
            executeAction(ctx, action, depth + 1);
          }
        }

        effectState.intervalTimer += effect.intervalCooldown;

        effectState.usesRemaining--;
        if (effectState.usesRemaining <= 0) {
          delete stateMap[key];
        }
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

function executeAction(ctx, action, depth = 0) {
  if (depth >= MAX_PROC_DEPTH) {
    console.error('MAX_PROC_DEPTH');
    return;
  }

  const { cooldowns } = ctx.state;
  const { duration, offset } = action;

  // Triggered on cast
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // Advance time forwards to hit
  if (offset) {
    executeIntervalActions(ctx, offset, depth);
    advanceNegativeStatuses(ctx, offset);

    advanceEffects(ctx, offset);
    advanceTune(ctx, offset);
    advanceCooldowns(cooldowns, offset);
  }

  // Hits (spaced hitInterval apart)
  const hitCount = getHitCount(action);
  const hitInterval = (duration - offset) / hitCount;
  for (let i = 0; i < hitCount; i++) {
    // Hit
    if (ctx.recordFootprint) {
      const footprint = buildFootprint(ctx, action);
      ctx.footprints.push(footprint);
    }
    decayProcCounts(ctx, action);

    // Apply tune if damage
    if (action.type === 'damage') {
      applyTune(ctx, action);
    }

    // Triggered on hit
    applyEffects(ctx, action, 'hit');
    executeFollowUpActions(ctx, action, depth);

    // Advance time after hit
    if (hitInterval) {
      executeIntervalActions(ctx, hitInterval, depth);
      advanceNegativeStatuses(ctx, hitInterval);

      advanceEffects(ctx, hitInterval);
      advanceTune(ctx, hitInterval);
      advanceCooldowns(cooldowns, hitInterval);
    }
  }
}

export const createRunRotation = (helpers, cache, equipMaps, currId) => {
  const ctx = {
    helpers,
    cache,
    equipMaps,
    currId,
    state: {
      cooldowns: {
        apply: {},
        use: {},
      },
      effects: Object.fromEntries(
        cache.memberIds.map((memberId) => [memberId, {}])
      ),
      fieldEffects: {
        active: {},
        inactive: {},
      },
      debuffs: {},
      negativeStatuses: {},
      offTune: { level: 0 },
    },
    footprints: [],
  };

  // Rotation loop
  const memberOrder = cache.memberIds.toReversed();
  for (const memberId of memberOrder) {
    const { rotation } = cache.member[memberId];
    ctx.onFieldId = memberId;

    for (const action of rotation) {
      executeAction(ctx, action);
    }
  }
  ctx.recordFootprint = true;
  for (const memberId of memberOrder) {
    const { rotation } = cache.member[memberId];
    ctx.onFieldId = memberId;

    for (const action of rotation) {
      executeAction(ctx, action);
    }
  }

  // Resolve fixed footprints
  const fixedSummary = {};
  const remaining = [];

  for (const footprint of ctx.footprints) {
    if (!footprint.fixed) {
      remaining.push(footprint);
      continue;
    }

    addToSummary(fixedSummary, {
      key: footprint.key,
      ownerId: footprint.ownerId,
      type: footprint.type,
      dmgType: footprint.dmgType,
      value: footprint.fixed,
    });
  }

  // Return function to resolve remaining footprints
  return (statMap) => {
    const summary = { ...fixedSummary };

    for (const footprint of remaining) {
      const result = evaluateFootprint(helpers, { currId }, footprint, statMap);
      addToSummary(summary, result);
    }

    return summary;
  };
};

function addToSummary(summary, result) {
  const prev = summary[result.key];

  if (prev) {
    prev.value += result.value;
  } else {
    summary[result.key] = { ...result };
  }
}
