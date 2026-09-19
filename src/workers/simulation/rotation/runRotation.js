import { GI, WW } from '@/data';
import { toMergedObj, clamp } from '@/utils';
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
  applyGauge,
  advanceAuras,
  advanceIcdStates,
  checkInfusion,
} from './game-specific/genshin-impact';
import {
  consumeNegativeStatuses,
  inflictNegativeStatuses,
  advanceNegativeStatuses,
  replaceNegativeStatuses,
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
  advanceTune,
} from './game-specific/wuthering-waves';
import {
  canSnapshot,
  buildSnapshot,
  resolveSnapshot,
} from './snapshot';
import { getEffectStates } from './getEffectStates';
import { createEventFilter } from './filter';

function handleRemoveWhen(ctx, when, event) {
  function tryRemove(state, storeOwnerId) {
    const { effect } = state;
    const { remove } = effect;

    if (remove?.when !== when) return;
    const spec = {
      ...(event.reaction ? { reaction: event } : { action: event }),
      fieldId: storeOwnerId ?? event?.ownerId,
    };
    if (!ctx.eventFilter(remove.filter, effect, spec)) return;

    onRemoveDoCommand(ctx, effect, event?.ownerId ?? effect.ownerId);

    if (remove.offset) {
      state.removeTimer ??= remove.offset;
      return;
    }

    runRemoveEffect(state);
  }

  function updateStore(store, storeOwnerId) {
    for (const state of Object.values(store)) {
      tryRemove(state, storeOwnerId);
    }
  }

  const { globalEffects, memberEffects } = ctx.states;
  updateStore(globalEffects);

  const actionOwnerId = event?.ownerId;
  if (actionOwnerId) {
    updateStore(memberEffects[actionOwnerId], actionOwnerId);
    return;
  }

  for (const memberId in memberEffects) {
    updateStore(memberEffects[memberId], memberId);
  }
}

function handleUseWhen(ctx, when, event) {
  function tryUse(state, storeOwnerId) {
    const { effect } = state;
    const { use } = effect;

    if (use?.when !== when) return;
    if (state.isRunning || state.useCooldown) return;

    const spec = {
      ...(event.reaction ? { reaction: event } : { action: event }),
      fieldId: storeOwnerId ?? event?.ownerId,
    };
    if (!ctx.eventFilter(use.filter, effect, spec)) return;

    onUseDoCommand(ctx, effect, spec.action?.ownerId ?? effect.ownerId);
    runUseEffect(ctx, state);
  }

  function updateStore(store, storeOwnerId) {
    for (const state of Object.values(store)) {
      tryUse(state, storeOwnerId);
    }
  }

  const { globalEffects, memberEffects } = ctx.states;
  updateStore(globalEffects);

  const actionOwnerId = event?.ownerId;
  if (actionOwnerId) {
    updateStore(memberEffects[actionOwnerId], actionOwnerId);
    return;
  }

  for (const memberId in memberEffects) {
    updateStore(memberEffects[memberId], memberId);
  }
}

function handleApplyWhen(ctx, when, event) {
  const { gameId } = ctx.cache;
  const { applyCooldowns } = ctx.states;

  function tryApply(effect) {
    const { apply } = effect;
    if (apply?.when !== when) return;

    const applier = event?.ownerId ?? effect.ownerId;
    if (!apply.by.includes(applier) || applyCooldowns[effect.key]) return;

    if (
      apply.field &&
      apply.field !== (applier === ctx.states.onFieldId ? 'onField' : 'offField')
    ) return;

    const spec = {
      ...(event.reaction ? { reaction: event } : { action: event }),
      fieldId: applier,
    };
    if (!ctx.eventFilter(apply.filter, effect, spec)) return;

    onApplyDoCommand(ctx, effect, applier);
    runApplyEffect(ctx, effect, { applier, inflict: event?.inflict });
  }

  for (const memberId in ctx.cache.member) {
    const mCache = ctx.cache.member[memberId];

    for (const effectKey in mCache.effects) {
      const effect = mCache.effects[effectKey];
      tryApply(effect);
    }
  }

  if (gameId === GI) {
    for (const effect of ctx.cache.elementalResonance.effects) {
      tryApply(effect);
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

    if (buffCooldown) continue;
    const spec = {
      action,
      fieldId: action.ownerId,
    };
    if (!ctx.eventFilter(effect.buff?.filter, effect, spec)) continue;

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
  const { gameId } = ctx.cache;
  const { duration = 0, hitOffsets = [0] } = action;
  let actionRuntime = 0;

  function advanceTimeTo(timestamp) {
    if (noDuration) return;

    const elapsed = timestamp - actionRuntime;
    if (elapsed <= 0) return;

    if (gameId === GI) {
      advanceAuras(ctx, elapsed);
      advanceIcdStates(ctx, elapsed);
    }

    if (gameId === WW) {
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

  const runEffectsWhen = (when) => ctx.runEffectsWhen(when, action);

  if (action.key === 'system:tuneBreak') {
    runTuneBreak(ctx, action);
    runEffectsWhen('tuneBreak');
    return;
  }

  // Action timeline
  runEffectsWhen('start');
  advanceTimeTo(hitOffsets[0]);

  let sharedSnapshot;
  if (canSnapshot(action)) {
    if (ctx.saveSnapshots) {
      sharedSnapshot = buildSnapshot(ctx, action, {
        runtimeOffset,
        infusedElement: checkInfusion(ctx, action),
      });
    }

    if (gameId === WW && action.damage) {
      applyOffTuneBuildup(ctx, action);
    }

    decayBuffStates(ctx, action);
  }

  if (gameId === WW) {
    consumeNegativeStatuses(ctx, action);
    inflictNegativeStatuses(ctx, action);
    replaceNegativeStatuses(ctx, action);
    inflictTuneShifting(ctx, action);
  }

  runEffectsWhen('inflict');

  for (const offset of hitOffsets) {
    advanceTimeTo(offset);
    runEffectsWhen('hit');

    if (action.drain) {
      const { targets, value } = action.drain;
      const { memberHealth } = ctx.states;

      for (const targetId of targets) {
        const prev = memberHealth[targetId];
        const next = clamp(prev - value, 0, 1);

        if (next !== prev) {
          memberHealth[targetId] = next;
          runEffectsWhen('healthChange');
        }
      }
    }

    let scaleMult = 1;
    if (gameId === GI) {
      const infusionElement = checkInfusion(ctx, action);
      scaleMult = applyGauge(ctx, action, infusionElement);
    }

    if (sharedSnapshot) {
      ctx.snapshots.push({
        ...sharedSnapshot,
        runtime: sharedSnapshot.runtime + actionRuntime - hitOffsets[0],
        unresolved: {
          ...sharedSnapshot.unresolved,
          scale: scaleMult,
        },
      });
    }
  }

  advanceTimeTo(duration);
  runEffectsWhen('end');
}

function runEffectsWhen(ctx, when, event) {
  handleRemoveWhen(ctx, when, event);
  handleUseWhen(ctx, when, event);
  handleApplyWhen(ctx, when, event);
}

export const runRotation = (cache, equipMaps, specId) => {
  const { gameId, memberIds } = cache;

  const ctx = {
    cache,
    specId,
    buildMaps: Object.fromEntries(
      Object.entries(equipMaps).map(([memberId, equipMap]) => {
        const { baseMap, staticMap } = cache.member[memberId];
        const sources = [baseMap, staticMap, equipMap];

        if (gameId === GI) {
          sources.push(cache.elementalResonance.stats);
        }

        return [memberId, toMergedObj(...sources)];
      })
    ),
    states: {
      runtime: 0,
      onFieldId: null,
      getField(id) {
        return id === this.onFieldId ? 'onField' : 'offField';
      },
      applyCooldowns: {},
      globalEffects: {},
      memberEffects: Object.fromEntries(memberIds.map((id) => [id, {}])),
      memberHealth: Object.fromEntries(memberIds.map((id) => [id, 1])),
      ...(gameId === GI && {
        icd: Object.fromEntries(memberIds.map((id) => [id, {}])),
        aura: {},
        shielded: false,
      }),
      ...(gameId === WW && {
        negativeStatuses: {},
        tune: { offTune: 0 },
      }),
    },
    snapshots: [],
    saveSnapshots: false,
    ...(gameId === WW && {
      offTuneBuildup: [],
    }),
  };

  ctx.eventFilter = createEventFilter(ctx);
  ctx.runAction = (action, options) => runAction(ctx, action, options);
  ctx.runEffectsWhen = (when, event) => runEffectsWhen(ctx, when, event);

  // Apply passive effects into states
  for (const memberId in cache.member) {
    const mCache = cache.member[memberId];

    for (const effectKey in mCache.effects) {
      const effect = mCache.effects[effectKey];

      if (!effect.static && !effect.apply?.when) {
        runApplyEffect(ctx, effect);
      }
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      if (!effect.static && !effect.apply?.when) {
        runApplyEffect(ctx, effect);
      }
    }
  }

  // Rotation loop
  const memberOrder = memberIds.toReversed();
  function runCycle() {
    for (const memberId of memberOrder) {
      ctx.states.onFieldId = memberId;
      ctx.runEffectsWhen('swap');

      const { rotation } = cache.member[memberId];
      for (const action of rotation) {
        ctx.runAction(action);
      }
    }
  }

  // First pass to initialize states
  runCycle();
  if (gameId === WW) {
    ctx.offTuneBuildup.push(ctx.states.tune.offTune);
  }

  // Second pass to record snapshots
  ctx.saveSnapshots = true;
  runCycle();

  // Resolve snapshots
  for (const snapshot of ctx.snapshots) {
    resolveSnapshot(ctx, snapshot);
  }

  if (!specId) {
    return ctx.snapshots.map(({ unresolved: _, ...snapshot }) => snapshot);
  }

  return (buildMap) => ctx.snapshots.map((snapshot) => {
    const resolved = { ...snapshot };

    for (const part of SNAPSHOT_PARTS) {
      if (typeof snapshot[part] === 'function') {
        resolved[part] = snapshot[part](buildMap);
      }
    }

    return resolved;
  });
};

const SNAPSHOT_PARTS = ['damage', 'healing', 'shield'];
