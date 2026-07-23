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
import { buildSnapshot, evaluateSnapshot } from './snapshot';
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
        for (const action of effect.intervalAction) runAction(ctx, action);
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
  let actionRuntime = 0;

  function advanceTimeTo(timestamp) {
    const elapsed = timestamp - actionRuntime;
    if (elapsed <= 0) return;

    runIntervalActions(ctx, elapsed);
    advanceNegativeStatuses(ctx, elapsed);
    advanceTune(ctx, elapsed);
    advanceEffects(ctx, elapsed);
    advanceApplyCooldowns(ctx, elapsed);

    actionRuntime += elapsed;
    if (ctx.saveSnapshots) ctx.state.runtime += elapsed;
  };

  function runEffectsWhen(when) {
    handleRemoveWhen(ctx, action, when);
    handleExtendWhen(ctx, action, when);
    handleUseWhen(ctx, action, when);
    handleApplyWhen(ctx, action, when);
  }

  if (action.key === 'other:tuneBreak') {
    runTuneBreak(ctx, action);
    runEffectsWhen('tuneBreak');
    return;
  }

  // Action timeline
  runEffectsWhen('before');
  advanceTimeTo(hitOffsets[0]);

  if (action.compressed) {
    if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, action));
    applyOffTuneBuildup(ctx, action);
    decayUsedBuffs(ctx, action);
  }

  inflictNegativeStatuses(ctx, action);
  inflictTuneShifting(ctx, action);
  runEffectsWhen('inflict');

  for (const offset of hitOffsets) {
    advanceTimeTo(offset);
    runEffectsWhen('hit');
  }

  advanceTimeTo(duration);
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
    state: {
      runtime: 0,
      applyCooldowns: {},
      memberEffects: Object.fromEntries(cache.memberIds.map((id) => [id, {}])),
      globalEffects: {},
      negativeStatuses: {},
      tune: { offTune: 0 },
    },
    runAction,
    snapshots: [],
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
    .flatMap((memberId) => cache.member[memberId].rotation);

  for (const action of actionOrder) {
    ctx.onFieldId = action.ownerId;
    runAction(ctx, action);
  }
  ctx.offTuneBuildup.push(ctx.state.tune.offTune);
  ctx.saveSnapshots = true;
  for (const action of actionOrder) {
    ctx.onFieldId = action.ownerId;
    runAction(ctx, action);
  }

  return (buildMap) => ctx.snapshots.map((snapshot) =>
    'value' in snapshot
      ? snapshot
      : {
        ...snapshot,
        value: evaluateSnapshot(helpers, currId, snapshot, buildMap),
      });
};
