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
  applyGauge,
  advanceAuras,
} from './special/elementalGauge';
import {
  advanceIcdStates,
} from './special/icd';
import {
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
  advanceTune,
} from './special/tune';
import { buildSnapshot, splitPerHit, scaleResolved } from './snapshot';
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
      runApplyEffect(ctx, effect, { applier, inflict: action?.inflict });
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

    if (ctx.cache.gameId === GI) {
      advanceAuras(ctx, elapsed);
      advanceIcdStates(ctx, elapsed);
    }

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

  // Melt/vaporize only amplify the specific hit that triggers them, so these
  // actions can't have their damage batched into one snapshot up front - ICD
  // determines which hits react only once we're inside the hitOffsets loop.
  const isAmpReactive = ctx.cache.gameId === GI
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
      const multiplier = applyGauge(ctx, action);

      if (isAmpReactive && ctx.saveSnapshots) {
        ctx.snapshots.push({
          key: action.key,
          name: action.name,
          ownerId: action.ownerId,
          category: action.category,
          type: action.type,
          field: ctx.states.getField(action.ownerId),
          runtime: ctx.states.runtime + (runtimeOffset ?? 0),
          damageType: action.damage.type,
          damage: scaleResolved(perHitDamage, multiplier),
        });
      }
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
        icd: Object.fromEntries(cache.memberIds.map((id) => [id, {}])),
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
