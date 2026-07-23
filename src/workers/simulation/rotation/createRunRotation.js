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
  for (const state of getEffectStates(ctx, { member: action.ownerId, type: 'buff' })) {
    const { store, effect, useCooldown } = state;
    if (useCooldown || !matchUseFilter(effect, { ctx, action })) continue;

    if (effect.useCooldown) {
      state.useCooldown = effect.useCooldown;
    }

    if (state.usesLeft) {
      state.usesLeft--;
      if (!state.usesLeft) {
        delete store[effect.key];
      }
    }
  }
}

function handleRemoveWhen(ctx, action, when) {
  for (const state of getEffectStates(ctx, { member: action.ownerId })) {
    const { effect } = state;
    const shouldRemove =
      effect.removeWhen === when &&
      matchRemoveFilter(effect, { ctx, action });

    if (!shouldRemove) continue;
    runRemoveEffect(state);
  }
}

function handleExtendWhen(ctx, action, when) {
  for (const state of getEffectStates(ctx, { member: action.ownerId })) {
    const { effect } = state;
    const shouldExtend =
      effect.extendWhen === when &&
      !state.extendCooldown &&
      matchExtendFilter(effect, { ctx, action }) &&
      state.extensionsLeft;

    if (!shouldExtend) continue;
    runExtendEffect(state);
  }
}

function handleUseWhen(ctx, action, when) {
  for (const state of getEffectStates(ctx, { member: action.ownerId })) {
    const { effect } = state;
    const shouldUse =
      effect.useWhen === when &&
      !state.useCooldown &&
      matchUseFilter(effect, { ctx, action }) &&
      !state.isRunning;

    if (!shouldUse) continue;
    onUseDoCommand(ctx, effect);
    runUseEffect(ctx, state);
  }
}

function handleApplyWhen(ctx, action, when) {
  for (const effect of Object.values(ctx.cache.effects)) {
    const shouldApply =
      effect.applyBy.includes(action.ownerId) &&
      effect.applyWhen === when &&
      !ctx.states.applyCooldowns[effect.key] &&
      matchApplyFilter(effect, { ctx, action });

    if (!shouldApply) continue;
    onApplyDoCommand(ctx, effect);
    runApplyEffect(ctx, effect, action);
  }
}

function advanceCooldowns(ctx, elapsed) {
  const { applyCooldowns } = ctx.states;
  for (const effectKey in applyCooldowns) {
    applyCooldowns[effectKey] -= elapsed;
    if (applyCooldowns[effectKey] <= 0) delete applyCooldowns[effectKey];
  }
}

function runAction(ctx, action, options = {}) {
  const { runtimeOffset, noDuration } = options;
  const { duration = 0, hitOffsets = [0] } = action;
  let actionRuntime = 0;

  function advanceTimeTo(timestamp) {
    if (noDuration) return;
    const elapsed = timestamp - actionRuntime;
    if (elapsed <= 0) return;

    advanceNegativeStatuses(ctx, elapsed);
    advanceTune(ctx, elapsed);
    advanceEffects(ctx, elapsed);
    advanceCooldowns(ctx, elapsed);

    actionRuntime += elapsed;
    if (ctx.saveSnapshots) ctx.states.runtime += elapsed;
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
    if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, action, { runtimeOffset }));
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
    states: {
      runtime: 0,
      applyCooldowns: {},
      globalEffects: {},
      memberEffects: Object.fromEntries(cache.memberIds.map((id) => [id, {}])),
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
  ctx.offTuneBuildup.push(ctx.states.tune.offTune);
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
