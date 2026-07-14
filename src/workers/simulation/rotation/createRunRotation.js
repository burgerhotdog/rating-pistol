import { mergeObj } from '@/utils';
import { advanceCooldowns } from './state/cooldowns';
import { applyEffects, applyPassives, removeEffects, advanceEffects } from './state/effects';
import { advanceNegativeStatuses } from './state/negativeStatuses';
import { applyTune, advanceTune, runTuneBreak } from './state/tune';
import { buildFootprint, evaluateFootprint } from './footprint';
import { getUsedBuffStates, getUsedFollowUpStates, resolveBuffMap } from './getCurrent';

const MAX_PROC_DEPTH = 5;

function decayUsedBuffs(ctx, usedBuffStates) {
  const { memberEffects, fieldEffects } = ctx.state;

  for (const [stateMapType, stateMapKey, effectState] of usedBuffStates) {
    const { effect } = effectState;

    if ('useCooldown' in effect) {
      effectState.cooldown = effect.useCooldown;
    }

    effectState.usesRemaining--;
    if (!effectState.usesRemaining) {
      if (stateMapType === 'member') {
        delete memberEffects[stateMapKey][effect.key];
      } else {
        delete fieldEffects[stateMapKey][effect.key];
      }
    }
  }
}

function runFollowUpActions(ctx, action, depth) {
  const { memberEffects, fieldEffects } = ctx.state;
  const usedFollowUpStates = getUsedFollowUpStates(ctx, action.ownerId, action);

  for (const [stateMapType, stateMapKey, effectState] of usedFollowUpStates) {
    const { effect } = effectState;

    if (effectState.executing) continue;

    effectState.executing = true;
    for (const action of effect.followUpAction) {
      for (let i = 0; i < effect.times; i ++) {
        runAction(ctx, action, depth + 1);
      }
    }
    effectState.executing = false;

    if ('useCooldown' in effect) {
      effectState.cooldown = effect.useCooldown;
    }

    effectState.usesRemaining--;
    if (effectState.usesRemaining <= 0) {
      if (stateMapType === 'member') {
        delete memberEffects[stateMapKey][effect.key];
      } else {
        delete fieldEffects[stateMapKey][effect.key];
      }
    }
  }
}

function runIntervalActions(ctx, elapsed, depth) {
  const { memberEffects } = ctx.state;

  for (const stateMap of Object.values(memberEffects)) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      const { effect } = effectState;

      if (!('intervalAction' in effect)) continue;

      effectState.intervalTimer -= elapsed;
      while (effectState.intervalTimer <= 0) {
        for (const action of effect.intervalAction) {
          for (let i = 0; i < effect.times; i ++) {
            runAction(ctx, action, depth + 1);
          }
        }

        effectState.intervalTimer += effect.intervalCooldown;

        effectState.usesRemaining--;
        if (!effectState.usesRemaining) {
          delete stateMap[key];
        }
      }
    }
  }
}

function runAction(ctx, action, depth = 0) {
  if (depth >= MAX_PROC_DEPTH) {
    console.error('MAX_PROC_DEPTH');
    return;
  }

  const { cooldowns, tune } = ctx.state;
  const { duration, offset } = action;

  // Triggered on cast
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // Advance time forwards to hit
  if (offset) {
    runIntervalActions(ctx, offset, depth);
    advanceNegativeStatuses(ctx, offset);

    advanceTune(tune, offset);
    advanceEffects(ctx, offset);
    advanceCooldowns(cooldowns, offset);
  }

  // Hit
  const usedBuffStates = getUsedBuffStates(ctx, action.ownerId, action);
  const { fixedBuffMap, variableBuffSpecs } = resolveBuffMap(ctx, usedBuffStates);

  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action, fixedBuffMap, variableBuffSpecs);
    if (footprint) {
      ctx.footprints.push(footprint);
    }
  }

  decayUsedBuffs(ctx, usedBuffStates);

  // Trigger follow ups (spaced hitInterval apart)
  const { hitCount = 1 } = action.compressed ?? {};
  const hitInterval = (duration - offset) / hitCount;
  for (let i = 0; i < hitCount; i++) {
    // Apply tune if damage
    if (action.type === 'damage') {
      applyTune(ctx, action, mergeObj(ctx.buildMaps[action.ownerId], fixedBuffMap));
    }

    // Triggered on hit
    applyEffects(ctx, action, 'hit');
    runFollowUpActions(ctx, action, depth);

    // Advance time after hit
    if (hitInterval) {
      runIntervalActions(ctx, hitInterval, depth);
      advanceNegativeStatuses(ctx, hitInterval);

      advanceTune(tune, hitInterval);
      advanceEffects(ctx, hitInterval);
      advanceCooldowns(cooldowns, hitInterval);
    }
  }
}

export const createRunRotation = (helpers, cache, equipMaps, currId) => {
  const buildMaps = {};
  for (const [memberId, equipMap] of Object.entries(equipMaps)) {
    buildMaps[memberId] = mergeObj(cache.member[memberId].baseMap, equipMap);
  }

  const ctx = {
    helpers,
    cache,
    equipMaps,
    buildMaps,
    currId,
    state: {
      cooldowns: {},
      memberEffects: Object.fromEntries(
        cache.memberIds.map((id) => [id, {}])
      ),
      fieldEffects: {
        onField: {},
        offField: {},
      },
      debuffs: {},
      negativeStatuses: {},
      tune: { offTune: 0 },
    },
    footprints: [],
    offTuneBuildup: [],
  };

  // Init passives into effect states
  applyPassives(ctx, cache.passive);

  // Rotation loop
  const actionOrder = cache.memberIds
    .toReversed()
    .flatMap((memberId) =>
      cache.member[memberId].rotation);

  oneRotationPass(ctx, actionOrder);
  ctx.offTuneBuildup.push(ctx.state.tune.offTune);
  ctx.recordFootprint = true;
  oneRotationPass(ctx, actionOrder);

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
      const result = evaluateFootprint(helpers, currId, footprint, statMap);
      addToSummary(summary, result);
    }
    return summary;
  };
};

function oneRotationPass(ctx, actionOrder) {
  for (const action of actionOrder) {
    ctx.onFieldId = action.ownerId;

    if (action.key === 'other:tuneBreak') {
      runTuneBreak(ctx);
    } else {
      runAction(ctx, action);
    }
  }
}

function addToSummary(summary, result) {
  const prev = summary[result.key];

  if (prev) {
    prev.value += result.value;
  } else {
    summary[result.key] = { ...result };
  }
}
