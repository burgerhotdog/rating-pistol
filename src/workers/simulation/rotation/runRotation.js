import { GI, WW } from '@/data';
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
  consumeNegativeStatuses,
  inflictNegativeStatuses,
  advanceNegativeStatuses,
  replaceNegativeStatuses,
} from './special/negativeStatuses';
import {
  inflictGauge,
} from './special/elementalGauge';
import {
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
  advanceTune,
} from './special/tune';
import { buildSnapshot } from './snapshot';
import { getEffectStates } from './getEffectStates';
import { createEventFilter } from './filter';

function handleRemoveWhen(ctx, when, { action, reaction }) {
  const states = getEffectStates(ctx, { member: action?.ownerId ?? 'all' });

  for (const state of states) {
    const { effect } = state;
    const { remove } = effect;

    if (
      remove?.when !== when ||
      !ctx.eventFilter(remove.filter, action ?? reaction, effect)
    ) continue;

    onRemoveDoCommand(ctx, effect, action?.ownerId ?? effect.ownerId);

    if (remove.offset) {
      state.removeTimer ??= remove.offset;
      continue;
    }

    runRemoveEffect(state);
  }
}

function handleUseWhen(ctx, when, { action, reaction }) {
  const states = getEffectStates(ctx, { member: action?.ownerId ?? 'all' });

  for (const state of states) {
    const { effect } = state;
    const { use } = effect;

    if (
      use?.when !== when ||
      state.isRunning ||
      state.useCooldown ||
      !ctx.eventFilter(use.filter, action ?? reaction, effect)
    ) continue;

    onUseDoCommand(ctx, effect, action?.ownerId ?? effect.ownerId);
    runUseEffect(ctx, state);
  }
}

function handleApplyWhen(ctx, when, { action, reaction }) {
  const { applyCooldowns } = ctx.states;

  for (const mCache of Object.values(ctx.cache.member)) {
    for (const effect of Object.values(mCache.effects)) {
      const { apply } = effect;

      const applier = action?.ownerId ?? effect.ownerId;

      if (
        apply?.when !== when ||
        !apply.by.includes(applier) ||
        applyCooldowns[effect.key] ||
        !ctx.eventFilter(apply.filter, action ?? reaction, effect)
      ) continue;

      onApplyDoCommand(ctx, effect, applier);
      runApplyEffect(ctx, effect, { applier, inflict: action.inflict });
    }
  }
}

function advanceCooldowns(ctx, elapsed) {
  const { applyCooldowns } = ctx.states;

  for (const effectKey in applyCooldowns) {
    applyCooldowns[effectKey] -= elapsed;

    if (applyCooldowns[effectKey] <= 0) {
      delete applyCooldowns[effectKey];
    }
  }
}

function decayBuffStates(ctx, action) {
  for (const state of getEffectStates(ctx, { member: action.ownerId, type: 'buff' })) {
    const { store, effect, buffCooldown } = state;

    if (
      buffCooldown ||
      !ctx.eventFilter(effect.buff?.filter, action, effect)
    ) continue;

    if (effect.buff?.cooldown) {
      state.buffCooldown = effect.buff.cooldown;
    }

    if (state.usesLeft) {
      state.usesLeft--;

      if (!state.usesLeft) {
        delete store[effect.key];
      }
    }
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

    if (ctx.cache.gameId === WW) {
      advanceNegativeStatuses(ctx, elapsed);
      advanceTune(ctx, elapsed);
    }

    advanceEffects(ctx, elapsed);
    advanceCooldowns(ctx, elapsed);

    actionRuntime += elapsed;

    if (ctx.saveSnapshots) {
      ctx.states.runtime += elapsed;
    }
  };

  const runEffectsWhen = (when) => ctx.runEffectsWhen(when, { action });

  if (action.key === 'other:tuneBreak') {
    runTuneBreak(ctx, action);
    runEffectsWhen('tuneBreak');
    return;
  }

  // Action timeline
  runEffectsWhen('start');
  advanceTimeTo(hitOffsets[0]);

  if (action.damage || action.healing || action.shield) {
    if (ctx.saveSnapshots) {
      const snapshot = buildSnapshot(ctx, action, { runtimeOffset });
      ctx.snapshots.push(snapshot);
    }

    if (ctx.cache.gameId === WW && action.damage) {
      applyOffTuneBuildup(ctx, action);
    }

    decayBuffStates(ctx, action);
  }

  if (ctx.cache.gameId === WW) {
    consumeNegativeStatuses(ctx, action);
    inflictNegativeStatuses(ctx, action);
    replaceNegativeStatuses(ctx, action);
    inflictTuneShifting(ctx, action);
  }

  runEffectsWhen('inflict');

  for (const offset of hitOffsets) {
    advanceTimeTo(offset);
    runEffectsWhen('hit');

    if (ctx.cache.gameId === GI) {
      inflictGauge(ctx, action);
    }
  }

  advanceTimeTo(duration);
  runEffectsWhen('end');
}

export const runRotation = (cache, equipMaps, specId) => {
  const { gameId } = cache;

  const buildMaps = {};
  for (const [memberId, equipMap] of Object.entries(equipMaps)) {
    const { baseMap, staticMap } = cache.member[memberId];
    buildMaps[memberId] = toMergedObj(baseMap, staticMap, equipMap);

    if (gameId === GI) {
      buildMaps[memberId] = toMergedObj(buildMaps[memberId], cache.elementalResonance.stats);
    }
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
      ...(gameId === GI && {
        aura: {},
        shielded: false,
      }),
      ...(gameId === WW && {
        negativeStatuses: {},
        tune: { offTune: 0 },
      }),
    },
    runAction,
    snapshots: [],
    saveSnapshots: false,
    ...(gameId === WW && {
      offTuneBuildup: [],
    }),
  };

  function runEffectsWhen(when, spec) {
    handleRemoveWhen(ctx, when, spec);
    handleUseWhen(ctx, when, spec);
    handleApplyWhen(ctx, when, spec);
  }

  ctx.runEffectsWhen = runEffectsWhen;

  ctx.eventFilter = createEventFilter(ctx);

  // Init passives into effect states
  for (const mCache of Object.values(cache.member)) {
    for (const effect of Object.values(mCache.effects)) {
      if (effect.apply?.when || effect.static) continue;
      runApplyEffect(ctx, effect);
    }
  }

  // Rotation loop
  const memberOrder = gameId === WW ? cache.memberIds.toReversed() : cache.memberIds;

  function runCycle() {
    for (const memberId of memberOrder) {
      ctx.states.onFieldId = memberId;

      const { rotation } = cache.member[memberId];
      for (const action of rotation) {
        runAction(ctx, action);
      }
    }
  }

  runCycle();
  if (gameId === WW) {
    ctx.offTuneBuildup.push(ctx.states.tune.offTune);
  }
  ctx.saveSnapshots = true;
  runCycle();

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
