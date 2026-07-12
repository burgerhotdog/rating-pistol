import { matchUse } from '../match';
import { advanceCooldowns } from './state/cooldowns';
import { applyEffects, removeEffects, advanceEffects } from './state/effects';
import { advanceNegativeStatuses } from './state/negativeStatuses';
import { applyTune, advanceTune, runTuneBreak } from './state/tune';
import { buildFootprint, evaluateFootprint } from './footprint';

const MAX_PROC_DEPTH = 5;

function decayUseCounts(ctx, action) {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;

  const stateMaps = [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
    debuffs,
  ];

  for (const stateMap of stateMaps) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      const { effect } = effectState;

      if (
        'followUpAction' in effect ||
        'intervalAction' in effect ||
        !matchUse(effect, action, action.ownerId, ctx)
      ) {
        continue;
      }

      effectState.usesRemaining -= 1;

      if (effectState.usesRemaining <= 0) {
        delete stateMap[key];
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
      ) {
        continue;
      }

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

      if (!('intervalAction' in effect)) {
        continue;
      }

      effectState.intervalTimer -= elapsed;
      while (effectState.intervalTimer <= 0) {
        for (const action of effect.intervalAction) {
          for (let i = 0; i < effect.times; i ++) {
            runAction(ctx, action, depth + 1);
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
  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action);
    if (footprint) {
      ctx.footprints.push(footprint);
    }
  }
  decayUseCounts(ctx, action);

  // Trigger follow ups (spaced hitInterval apart)
  const { hitCount = 1 } = action.compressed ?? {};
  const hitInterval = (duration - offset) / hitCount;
  for (let i = 0; i < hitCount; i++) {
    // Apply tune if damage
    if (action.type === 'damage') {
      applyTune(ctx, action);
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
  const ctx = {
    helpers,
    cache,
    equipMaps,
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

  // Rotation loop
  const actionOrder = cache.memberIds
    .toReversed()
    .flatMap((memberId) =>
      cache.member[memberId].rotation);

  oneRotationPass(ctx, actionOrder);
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
  const numBreaksMult =
    ctx.tuneBuildup[0] === 300
      ? 1
      : ctx.tuneBuildup[1] === 300
        ? 0.5
        : 1 / Math.ceil(300 / (ctx.tuneBuildup[1] - ctx.tuneBuildup[0]));
  
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
