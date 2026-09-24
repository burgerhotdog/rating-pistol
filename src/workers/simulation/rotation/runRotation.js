import { GI, WW } from '@/data';
import { toMergedObj } from '@/utils';
import { runApplyEffect } from './effects';
import { resolveSnapshot } from './snapshot';
import { createEventFilter } from './filter';
import { runAction } from './runAction';
import { runEffects } from './runEffects';

const initStates = (cache) => {
  const { gameId, memberIds } = cache;

  const initMemberStates = (init = () => ({})) =>
    Object.fromEntries(memberIds.map((id) => [id, init()]));

  const states = {
    runtime: 0,
    onFieldId: null,
    getField(id) {
      return id === this.onFieldId ? 'onField' : 'offField';
    },
    applyCooldowns: {},
    globalEffects: {},
    memberEffects: initMemberStates(),
    memberHealth: initMemberStates(() => 1),
  };

  if (gameId === GI) {
    states.icd = initMemberStates();
    states.aura = {};
    states.shield = false;
  }

  if (gameId === WW) {
    states.negativeStatuses = {};
    states.tune = { offTune: 0 };
  }

  return states;
};

export const runRotation = (cache, equipMaps, specId) => {
  const { gameId, memberIds } = cache;

  const ctx = {
    cache,
    specId,
    states: initStates(cache),
    snapshots: [],
    saveSnapshots: false,
    ...(gameId === WW && {
      offTuneBuildup: [],
    }),
  };

  ctx.buildMaps = Object.fromEntries(
    Object.entries(equipMaps).map(([memberId, equipMap]) => {
      const { baseMap, staticMap } = cache.member[memberId];
      const sources = [baseMap, staticMap, equipMap];

      if (gameId === GI) {
        sources.push(cache.elementalResonance.stats);
      }

      return [memberId, toMergedObj(...sources)];
    })
  );

  ctx.eventFilter = createEventFilter(ctx);
  ctx.runAction = (action, options) => runAction(ctx, action, options);
  ctx.runEffects = (when, event) => runEffects(ctx, when, event);

  // Apply passive effects into states
  for (const memberId in cache.member) {
    const mCache = cache.member[memberId];

    for (const effectKey in mCache.effects) {
      const effect = mCache.effects[effectKey];
      if (effect.static || effect.apply) continue;
      runApplyEffect(ctx, effect);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      if (effect.static || effect.apply) continue;
      runApplyEffect(ctx, effect, effect.apply);
    }
  }

  // Rotation loop
  const memberOrder = memberIds.toReversed();
  function runCycle() {
    for (const memberId of memberOrder) {
      ctx.states.onFieldId = memberId;
      ctx.runEffects('swap');

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
