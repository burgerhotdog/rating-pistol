import { toMergedObj } from '@/utils';
import {
  matchRemoveFilter,
  matchExtendFilter,
  matchUseFilter,
  matchApplyFilter,
} from './filter';
import {
  onUseDoCommand,
  onApplyDoCommand,
} from './commands';
import {
  runRemoveEffect,
  runExtendEffect,
  runUseEffect,
  runApplyEffect,
  advanceEffects,
} from './effects';
import {
  inflictNegativeStatuses,
  advanceNegativeStatuses,
} from './special/negativeStatuses';
import {
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
  advanceTune,
} from './special/tune';
import { buildFootprint, evaluateFootprint } from './footprint';
import { getEffectStates } from './getEffectStates';

function decayUsedBuffs(ctx, action) {
  for (const effectState of getEffectStates(ctx, {
    member: action.ownerId,
    type: 'buff',
  })) {
    const { stateMap, effect, useCooldown } = effectState;
    if (useCooldown || !matchUseFilter(effect, { ctx, action })) continue;

    if (effect.useCooldown) {
      effectState.useCooldown = effect.useCooldown;
    }

    if (effectState.usesLeft) {
      effectState.usesLeft--;
      if (!effectState.usesLeft) {
        delete stateMap[effect.key];
      }
    }
  }
}

function runIntervalActions(ctx, elapsed) {
  const effectStates = getEffectStates(ctx, { member: 'all' });
  for (const effectState of effectStates) {
    const { stateMap, effect } = effectState;

    if (!effect.intervalAction) continue;
    const { times = 1 } = effect;

    effectState.intervalTimer -= elapsed;
    while (effectState.intervalTimer <= 0) {
      for (let i = 0; i < times; i++) {
        for (const action of effect.intervalAction) {
          runAction(ctx, action);
        }
      }

      effectState.intervalTimer += effect.intervalCooldown;

      if (effectState.usesLeft) {
        effectState.usesLeft--;
        if (!effectState.usesLeft) {
          delete stateMap[effect.key];
          break;
        }
      }
    }
  }
}

function handleRemoveWhen(ctx, action, when) {
  for (const effectState of getEffectStates(ctx, {
    enemy: true,
    member: action.ownerId,
  })) {
    const { effect } = effectState;
    const shouldRemove =
      effect.removeWhen === when &&
      matchRemoveFilter(effect, { ctx, action });

    if (!shouldRemove) continue;
    runRemoveEffect(effectState);
  }
}

function handleExtendWhen(ctx, action, when) {
  for (const effectState of getEffectStates(ctx, {
    enemy: true,
    member: action.ownerId,
  })) {
    const { effect } = effectState;
    const shouldExtend =
      effect.extendWhen === when &&
      !effectState.extendCooldown &&
      matchExtendFilter(effect, { ctx, action }) &&
      effectState.extensionsLeft;

    if (!shouldExtend) continue;
    runExtendEffect(effectState);
  }
}

function handleUseWhen(ctx, action, when) {
  for (const effectState of getEffectStates(ctx, {
    enemy: true,
    member: action.ownerId,
  })) {
    const { effect } = effectState;
    const shouldUse =
      effect.useWhen === when &&
      !effectState.useCooldown &&
      matchUseFilter(effect, { ctx, action }) &&
      !effectState.isRunning;

    if (!shouldUse) continue;
    onUseDoCommand(ctx, effect);
    runUseEffect(effectState, ctx);
  }
}

function handleApplyWhen(ctx, action, when) {
  for (const effect of Object.values(ctx.cache.effects)) {
    const shouldApply =
      effect.applyBy.includes(action.ownerId) &&
      effect.applyWhen === when &&
      !ctx.state.applyCooldowns[effect.key] &&
      matchApplyFilter(effect, { ctx, action });

    if (!shouldApply) continue;
    onApplyDoCommand(ctx, effect);
    runApplyEffect(ctx, effect, action);
  }
}

function runEffects(ctx, action, when) {
  handleRemoveWhen(ctx, action, when);
  handleExtendWhen(ctx, action, when);
  handleUseWhen(ctx, action, when);
  handleApplyWhen(ctx, action, when);
}

function advanceApplyCooldowns(ctx, elapsed) {
  const { applyCooldowns } = ctx.state;

  for (const effectKey in applyCooldowns) {
    applyCooldowns[effectKey] -= elapsed;
    if (applyCooldowns[effectKey] <= 0) {
      delete applyCooldowns[effectKey];
    }
  }
}

function runAction(ctx, action) {
  const { duration = 0, hitOffsets = [0] } = action;
  let currentTime = 0;

  function runEffectsWhen(when) {
    runEffects(ctx, action, when);
  }

  if (action.key === 'other:tuneBreak') {
    runTuneBreak(ctx, action);
    runEffects(ctx, action, 'tuneBreak');
    return;
  }

  function advanceTime(elapsed) {
    if (elapsed <= 0) return;
    runIntervalActions(ctx, elapsed);
    advanceNegativeStatuses(ctx, elapsed);
    advanceTune(ctx, elapsed);
    advanceEffects(ctx, elapsed);
    advanceApplyCooldowns(ctx, elapsed);
    currentTime += elapsed;
  };

  // Action cast
  runEffectsWhen('before');
  advanceTime(hitOffsets[0]);

  // Action hit
  if (action.compressed) {
    if (ctx.recordFootprint) {
      const footprint = buildFootprint(ctx, action);
      if (footprint) {
        ctx.footprints.push(footprint);
      }
    }
    applyOffTuneBuildup(ctx, action);
    decayUsedBuffs(ctx, action);
  }

  inflictNegativeStatuses(ctx, action);
  inflictTuneShifting(ctx, action);
  runEffectsWhen('inflict');

  // Effects per hit
  for (const offset of hitOffsets) {
    advanceTime(offset - currentTime);
    runEffectsWhen('hit');
  }

  advanceTime(duration - currentTime);
  runEffectsWhen('after');
}

export const createRunRotation = (helpers, cache, equipMaps, currId) => {
  const buildMaps = {};
  for (const [memberId, equipMap] of Object.entries(equipMaps)) {
    buildMaps[memberId] = toMergedObj(cache.member[memberId].baseMap, equipMap);
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
      applyCooldowns: {},
      memberEffects: Object.fromEntries(
        cache.memberIds.map((id) => [id, {}])
      ),
      fieldEffects: {
        onField: {},
        offField: {},
      },
      enemyEffects: {},
      negativeStatuses: {},
      tune: { offTune: 0 },
    },
    runAction,
    footprints: [],
    offTuneBuildup: [],
  };

  // Init passives into effect states
  for (const effect of Object.values(cache.effects)) {
    if (effect.applyWhen) continue;
    runApplyEffect(ctx, effect);
  }

  // Rotation loop
  const actionOrder = cache.memberIds
    .toReversed()
    .flatMap((memberId) =>
      cache.member[memberId].rotation);

  for (const action of actionOrder) {
    ctx.onFieldId = action.ownerId;
    runAction(ctx, action);
  }
  ctx.offTuneBuildup.push(ctx.state.tune.offTune);
  ctx.recordFootprint = true;
  for (const action of actionOrder) {
    ctx.onFieldId = action.ownerId;
    runAction(ctx, action);
  }

  // Resolve fixed footprints
  const fixedSummary = {};
  const remaining = [];

  for (const footprint of ctx.footprints) {
    if (!('fixed' in footprint)) {
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


  return (statMap) => {
    const summary = { ...fixedSummary };
    for (const footprint of remaining) {
      const result = evaluateFootprint(helpers, currId, footprint, statMap);
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
