import { mergeObj } from '@/utils';
import { matchUse } from '../match';
import { advanceCooldowns } from './state/cooldowns';
import { applyEffect, applyEffects, applyPassives, removeEffects, advanceEffects } from './state/effects';
import { advanceNegativeStatuses } from './state/negativeStatuses';
import { applyTune, advanceTune } from './state/tune';
import { buildTuneFootprints, buildFootprint, evaluateFootprint } from './footprint';
import { getUsedBuffStates, resolveBuffMap } from './getCurrent';

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

  const actionOwnerFieldKey =
    ctx.onFieldId === action.ownerId
      ? 'onField'
      : 'offField';

  const stateMaps = [
    memberEffects[action.ownerId],
    fieldEffects[actionOwnerFieldKey],
  ];

  for (const stateMap of stateMaps) {
    for (const [effectKey, effectState] of Object.entries(stateMap)) {
      const { effect } = effectState;

      if (
        effectState.executing ||
        effectState.cooldown ||
        !('followUpAction' in effect) ||
        !matchUse(effect, action, action.ownerId, ctx)
      ) continue;

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
        delete stateMap[effectKey];
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

export function runTuneBreak(ctx) {
  const { cooldowns, tune, debuffs } = ctx.state;

  // Record offTune on 1st pass, footprint on 2nd pass
  if (!ctx.recordFootprint) { 
    ctx.tuneBuildup.push(tune.offTune);
  } else {
    ctx.tuneFootprints = buildTuneFootprints(ctx);
  }

  if (!tune.misTuned) return;

  if (tune.shifting) {
    console.log(tune.shifting);
    tune.interfered = tune.shifting;
    if (tune.shiftingStacks) {
      tune.interferedStacks = tune.shiftingStacks;
      delete tune.shiftingStacks;
    }
    tune.interferedDuration =
      tune.interfered === 'tuneStrain'
        ? 30000
        : 8000;
  }

  tune.misTuned = false;
  tune.offTune = 0;
  tune.offTuneCooldown = 4000;

  for (const effect of ctx.cache.special) {
    if (
      effect.applyOnSpecial !== 'tuneBreak' ||
      cooldowns[effect.key]
    ) continue;

    applyEffect(debuffs, effect);

    if ('applyCooldown' in effect) {
      cooldowns[effect.key] = effect.applyCooldown;
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
    tuneBuildup: [],
    tuneFootprints: [],
  };

  // Init passives into effect states
  applyPassives(ctx, cache.passive);

  // Rotation loop
  const actionOrder = cache.memberIds
    .toReversed()
    .flatMap((memberId) =>
      cache.member[memberId].rotation);

  oneRotationPass(ctx, actionOrder);
  ctx.tuneBuildup.push(ctx.state.tune.offTune);
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

  // Resolve tune break/response footprints
  const numBreaksMult = getNumBreaksMult(...ctx.tuneBuildup);
  
  for (const footprint of ctx.tuneFootprints) {
    addToSummary(fixedSummary, {
      key: footprint.key,
      ownerId: footprint.ownerId,
      type: footprint.type,
      dmgType: footprint.dmgType,
      value: footprint.fixed * numBreaksMult,
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

function getNumBreaksMult(firstTuneBreak, midpoint) {
  if (firstTuneBreak === 300) {
    return 1;
  }

  return 1 / Math.ceil(300 / midpoint);
}

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
