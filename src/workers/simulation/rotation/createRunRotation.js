import { mergeObj } from '@/utils';
import { advanceCooldowns } from './state/cooldowns';
import { applyEffects, applyPassives, removeEffects, advanceEffects } from './state/effects';
import { inflictNegativeStatuses, advanceNegativeStatuses } from './state/negativeStatuses';
import { applyOffTuneBuildup, inflictTuneShifting, advanceTune, runTuneBreak } from './state/tune';
import { buildFootprint, evaluateFootprint } from './footprint';
import { getUsedBuffStates, getUsedFollowUpStates, resolveBuffMap } from './getCurrent';

const MAX_PROC_DEPTH = 5;

function decayUsedBuffs(ctx, usedBuffStates) {
  for (const [stateMap, effectState] of usedBuffStates) {
    const { effect } = effectState;

    if ('useCooldown' in effect) {
      effectState.cooldown = effect.useCooldown;
    }

    effectState.usesRemaining--;
    if (!effectState.usesRemaining) {
      delete stateMap[effect.key];
    }
  }
}

function runFollowUpActions(ctx, action, depth) {
  const usedFollowUpStates = getUsedFollowUpStates(ctx, action.ownerId, action);

  for (const [stateMap, effectState] of usedFollowUpStates) {
    const { effect } = effectState;
    const { times = 1 } = effect;

    if (effectState.executing) continue;

    effectState.executing = true;
    for (const action of effect.followUpAction) {
      for (let i = 0; i < times; i ++) {
        runAction(ctx, action, depth + 1);
      }
    }
    effectState.executing = false;

    if ('useCooldown' in effect) {
      effectState.cooldown = effect.useCooldown;
    }

    effectState.usesRemaining--;
    if (effectState.usesRemaining <= 0) {
      delete stateMap[effect.key];
    }
  }
}

function runIntervalActions(ctx, elapsed, depth) {
  const { memberEffects } = ctx.state;

  for (const stateMap of Object.values(memberEffects)) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      const { effect } = effectState;
      const { times = 1 } = effect;

      if (!('intervalAction' in effect)) continue;

      effectState.intervalTimer -= elapsed;
      while (effectState.intervalTimer <= 0) {
        for (const action of effect.intervalAction) {
          for (let i = 0; i < times; i++) {
            runAction(ctx, action, depth + 1);
          }
        }

        effectState.intervalTimer += effect.intervalCooldown;

        effectState.usesRemaining--;
        if (!effectState.usesRemaining) {
          delete stateMap[key];
          break;
        }
      }
    }
  }
}

function advanceTime(ctx, elapsed, depth) {
  runIntervalActions(ctx, elapsed, depth);
  advanceNegativeStatuses(ctx, elapsed);

  advanceTune(ctx.state.tune, elapsed);
  advanceEffects(ctx, elapsed);
  advanceCooldowns(ctx.state.cooldowns, elapsed);
}

function runAction(ctx, action, depth = 0) {
  if (depth >= MAX_PROC_DEPTH) {
    console.error('MAX_PROC_DEPTH');
    return;
  }

  let currentTime = 0;

  // Action is cast
  removeEffects(ctx, action, 'before');
  applyEffects(ctx, action, 'cast');

  // Advance time to initial hit
  if (action.hitOffsets) {
    const initialOffset = action.hitOffsets[0];
    if (initialOffset > 0) {
      currentTime += initialOffset;
      advanceTime(ctx, initialOffset, depth);
    }
  }

  // Initial hit
  if (action.compressed) {
    const usedBuffStates = getUsedBuffStates(ctx, action.ownerId, action);
    const { fixedBuffMap, variableBuffSpecs } = resolveBuffMap(ctx, usedBuffStates);

    if (ctx.recordFootprint) {
      const footprint = buildFootprint(ctx, action, fixedBuffMap, variableBuffSpecs);
      if (footprint) {
        ctx.footprints.push(footprint);
      }
    }

    applyOffTuneBuildup(ctx, action, fixedBuffMap);
    decayUsedBuffs(ctx, usedBuffStates);
  }

  // Should only happen once regardless of hits
  inflictNegativeStatuses(ctx, action);
  inflictTuneShifting(ctx, action);

  // Triggered on hit
  applyEffects(ctx, action, 'hit');
  runFollowUpActions(ctx, action, depth);

  if (action.hitOffsets) {
    const [, ...remainingOffsets] = action.hitOffsets;

    for (const hitOffset of remainingOffsets) {
      // Advance time to hitOffset
      const elapsed = hitOffset - currentTime;
      if (elapsed > 0) {
        currentTime += elapsed;
        advanceTime(ctx, elapsed, depth);
      }

      // Triggered on hit
      applyEffects(ctx, action, 'hit');
      runFollowUpActions(ctx, action, depth);
    }
  }

  // Advance time after last hit
  const postHits = action.duration - currentTime;
  if (postHits > 0) {
    advanceTime(ctx, postHits, depth);
  }

  // End of action
  removeEffects(ctx, action, 'after');
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
    onFieldId: null,
    getField(id) {
      return id === this.onFieldId
        ? 'onField'
        : 'offField';
    },
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
  applyPassives(ctx);

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
