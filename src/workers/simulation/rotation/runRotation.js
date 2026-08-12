import { WW } from '@/data';
import { toMergedObj } from '@/utils';
import {
  onRemoveDoCommand,
  onUseDoCommand,
  onApplyDoCommand,
} from './commands';
import {
  runRemoveEffect,
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
import { buildSnapshot } from './snapshot';
import { getEffectStates } from './getEffectStates';
import { createEventFilter } from './filter';

function handleRemoveWhen(ctx, action, when) {
  for (const state of getEffectStates(ctx, { member: action.ownerId })) {
    const { effect } = state;

    const shouldRemove =
      effect.remove &&
      effect.remove.when === when &&
      ctx.eventFilter(effect.remove.filter, action, effect);

    if (!shouldRemove) continue;
    onRemoveDoCommand(ctx, effect);
    runRemoveEffect(state);
  }
}

function handleUseWhen(ctx, action, when) {
  for (const state of getEffectStates(ctx, { member: action.ownerId })) {
    const { effect } = state;

    const shouldUse =
      effect.use?.when === when &&
      !state.useCooldown &&
      ctx.eventFilter(effect.use?.filter, action, effect) &&
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
      effect.apply?.when === when &&
      !ctx.states.applyCooldowns[effect.id] &&
      ctx.eventFilter(effect.apply?.filter, action, effect);

    if (!shouldApply) continue;

    onApplyDoCommand(ctx, effect);
    runApplyEffect(ctx, effect, { applier: action.ownerId });
  }
}

function advanceCooldowns(ctx, elapsed) {
  const { applyCooldowns } = ctx.states;
  for (const effectId in applyCooldowns) {
    applyCooldowns[effectId] -= elapsed;
    if (applyCooldowns[effectId] <= 0) delete applyCooldowns[effectId];
  }
}

function decayBuffStates(ctx, action) {
  for (const state of getEffectStates(ctx, { member: action.ownerId, type: 'buff' })) {
    const { store, effect, useCooldown } = state;
    if (
      useCooldown ||
      !ctx.eventFilter(effect.use?.filter, action, effect)
    ) continue;

    if ('buffCooldown' in effect) state.buffCooldown = effect.buffCooldown;
    if ('usesLeft' in state) {
      state.usesLeft--;
      if (!state.usesLeft) delete store[effect.id];
    }
  }
}

const canSnapshot = (action) =>
  'damage' in action ||
  'healing' in action ||
  'shield' in action;

function runAction(ctx, action, options = {}) {
  const { runtimeOffset, noDuration } = options;
  const { duration = 0, hitOffsets = [0] } = action;
  let actionRuntime = 0;

  function advanceTimeTo(timestamp) {
    if (noDuration) return;
    const elapsed = timestamp - actionRuntime;
    if (elapsed <= 0) return;

    if (ctx.cache.gameId === WW) advanceNegativeStatuses(ctx, elapsed);
    if (ctx.cache.gameId === WW) advanceTune(ctx, elapsed);
    advanceEffects(ctx, elapsed);
    advanceCooldowns(ctx, elapsed);

    actionRuntime += elapsed;
    if (ctx.saveSnapshots) ctx.states.runtime += elapsed;
  };

  function runEffectsWhen(when) {
    handleRemoveWhen(ctx, action, when);
    handleUseWhen(ctx, action, when);
    handleApplyWhen(ctx, action, when);
  }

  if (action.id === 'other:tuneBreak') {
    runTuneBreak(ctx, action);
    runEffectsWhen('tuneBreak');
    return;
  }

  // Action timeline
  runEffectsWhen('start');
  advanceTimeTo(hitOffsets[0]);

  if (canSnapshot(action)) {
    if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, action, { runtimeOffset }));
    if (ctx.cache.gameId === WW && 'damage' in action) applyOffTuneBuildup(ctx, action);
    decayBuffStates(ctx, action);
  }

  if (ctx.cache.gameId === WW) inflictNegativeStatuses(ctx, action);
  if (ctx.cache.gameId === WW) inflictTuneShifting(ctx, action);
  if (ctx.cache.gameId === WW) runEffectsWhen('inflict');

  for (const offset of hitOffsets) {
    advanceTimeTo(offset);
    runEffectsWhen('hit');
  }

  advanceTimeTo(duration);
  runEffectsWhen('end');
}

export const runRotation = (cache, equipMaps, specId) => {  
  const buildMaps = {};
  for (const [memberId, equipMap] of Object.entries(equipMaps)) {
    buildMaps[memberId] = toMergedObj(cache.member[memberId].baseMap, equipMap);
  }

  const ctx = {
    cache,
    buildMaps,
    specId,
    states: {
      runtime: 0,
      onFieldId: null,
      getField(id) {
        return id === this.onFieldId ? 'onField' : 'offField';
      },
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

  ctx.eventFilter = createEventFilter(ctx);

  // Init passives into effect states
  for (const effect of Object.values(cache.effects)) {
    if (effect.apply?.when) continue;
    runApplyEffect(ctx, effect);
  }

  // Rotation loop
  const actionOrder = cache.memberIds
    .toReversed()
    .flatMap((memberId) =>
      cache.member[memberId].rotation);

  for (const action of actionOrder) {
    ctx.states.onFieldId = action.ownerId;
    runAction(ctx, action);
  }
  ctx.offTuneBuildup.push(ctx.states.tune.offTune);
  ctx.saveSnapshots = true;
  for (const action of actionOrder) {
    ctx.states.onFieldId = action.ownerId;
    runAction(ctx, action);
  }

  if (!specId) {
    return ctx.snapshots;
  }

  return (buildMap) => ctx.snapshots.map((snapshot) => {
    const toResolve = [];
    for (const part of ['damage', 'healing', 'shield']) {
      if (part in snapshot && typeof snapshot[part] === 'function') {
        toResolve.push(part);
      }
    }

    const resolved = { ...snapshot };
    for (const type of toResolve) {
      resolved[type] = snapshot[type](buildMap);
    }

    return resolved;
  });
};
