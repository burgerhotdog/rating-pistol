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
  applyGauge,
  advanceAuras,
  advanceIcdStates,
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
import { buildSnapshot, splitPerHit, scaleResolved } from './snapshot';
import { getEffectStates } from './getEffectStates';
import { createEventFilter } from './filter';

function handleRemoveWhen(ctx, when, spec = {}) {
  function tryRemove(state, storeOwnerId) {
    const { effect } = state;
    const { remove } = effect;

    if (remove?.when !== when) return;
    if (!ctx.eventFilter(remove.filter, effect, { ...spec, fieldId: storeOwnerId ?? spec.action?.ownerId })) return;

    onRemoveDoCommand(ctx, effect, spec.action?.ownerId ?? effect.ownerId);

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

  const actionOwnerId = spec.action?.ownerId;
  if (actionOwnerId) {
    updateStore(memberEffects[actionOwnerId], actionOwnerId);
    return;
  }

  for (const memberId in memberEffects) {
    updateStore(memberEffects[memberId], memberId);
  }
}

function handleUseWhen(ctx, when, spec = {}) {
  function tryUse(state, storeOwnerId) {
    const { effect } = state;
    const { use } = effect;

    if (use?.when !== when) return;
    if (state.isRunning || state.useCooldown) return;
    if (!ctx.eventFilter(use.filter, effect, { ...spec, fieldId: storeOwnerId ?? spec.action?.ownerId })) return;

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

  const actionOwnerId = spec.action?.ownerId;
  if (actionOwnerId) {
    updateStore(memberEffects[actionOwnerId], actionOwnerId);
    return;
  }

  for (const memberId in memberEffects) {
    updateStore(memberEffects[memberId], memberId);
  }
}

function handleApplyWhen(ctx, when, spec = {}) {
  const { gameId } = ctx.cache;
  const { applyCooldowns } = ctx.states;

  function tryApply(effect) {
    const { apply } = effect;
    if (apply?.when !== when) return;

    const applier = spec.action?.ownerId ?? effect.ownerId;
    if (!apply.by.includes(applier) || applyCooldowns[effect.key]) return;
    if (!ctx.eventFilter(apply.filter, effect, { ...spec, fieldId: applier })) return;

    onApplyDoCommand(ctx, effect, applier);
    runApplyEffect(ctx, effect, { applier, inflict: spec.action?.inflict });
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
    if (!ctx.eventFilter(effect.buff?.filter, effect, { action, fieldId: action.ownerId })) continue;

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

  const runEffectsWhen = (when) => ctx.runEffectsWhen(when, { action });

  if (action.key === 'system:tuneBreak') {
    runTuneBreak(ctx, action);
    runEffectsWhen('tuneBreak');
    return;
  }

  // Melt/vaporize only amplify the specific hit that triggers them, so these
  // actions can't have their damage batched into one snapshot up front - ICD
  // determines which hits react only once we're inside the hitOffsets loop.
  const isAmpReactive = gameId === GI
    && action.damage
    && ['pyro', 'cryo', 'hydro'].includes(action.damage.element);
  let perHitDamage;

  // Action timeline
  runEffectsWhen('start');
  advanceTimeTo(hitOffsets[0]);

  if (action.damage || action.healing || action.shield) {
    if (ctx.saveSnapshots) {
      const snapshot = buildSnapshot(ctx, action, { runtimeOffset });

      if (isAmpReactive) {
        perHitDamage = splitPerHit(snapshot, 'damage', hitOffsets.length);
        delete snapshot.damage;
        delete snapshot.damageType;

        // Only push the leftover shell if it still carries healing/shield.
        if (snapshot.healing !== undefined || snapshot.shield !== undefined) {
          ctx.snapshots.push(snapshot);
        }
      } else {
        ctx.snapshots.push(snapshot);
      }
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

    if (gameId === GI) {
      const multiplier = applyGauge(ctx, action);

      if (isAmpReactive && ctx.saveSnapshots) {
        ctx.snapshots.push({
          key: action.key,
          name: action.name,
          ownerId: action.ownerId,
          category: action.category,
          type: action.type,
          onFieldId: ctx.states.onFieldId,
          runtime: ctx.states.runtime + (runtimeOffset ?? 0),
          damageType: action.damage.type,
          damage: scaleResolved(perHitDamage, multiplier ?? 1),
        });
      }
    }
  }

  advanceTimeTo(duration);
  runEffectsWhen('end');
}

function runEffectsWhen(ctx, when, spec) {
  handleRemoveWhen(ctx, when, spec);
  handleUseWhen(ctx, when, spec);
  handleApplyWhen(ctx, when, spec);
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
  ctx.runEffectsWhen = (when, spec) => runEffectsWhen(ctx, when, spec);

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

  if (!specId) {
    return ctx.snapshots;
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
