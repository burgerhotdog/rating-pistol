import { GI, WW } from '@/data';
import { getAttr, toMergedObj } from '@/utils';
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

const initBuildMaps = (cache, equipMaps) => {
  const { gameId, memberIds } = cache;
  const buildMaps = {};

  for (const memberId of memberIds) {
    const sources = [
      cache.member[memberId].baseMap,
      cache.member[memberId].staticMap,
      equipMaps[memberId] ?? {},
    ];

    if (gameId === GI) {
      sources.push(cache.elementalResonance.stats);
    }

    buildMaps[memberId] = toMergedObj(...sources);
  }

  return buildMaps;
};

const initAttrMaps = (buildMaps) => {
  const attrMaps = {};

  for (const memberId in buildMaps) {
    const buildMap = buildMaps[memberId];
    const attrMap = {};

    for (const stat in buildMap) {
      const attr = stat.startsWith('base')
        ? stat[4].toLowerCase() + stat.slice(5)
        : stat;

      if (!(attr in attrMap)) {
        attrMap[attr] = getAttr(attr, buildMap);
      }
    }

    attrMaps[memberId] = attrMap;
  }

  return attrMaps;
};

export const runRotation = (cache, equipMaps, specId) => {
  const { gameId, memberIds } = cache;

  const ctx = {
    cache,
    specId,
    states: initStates(cache),
    snapshots: [],
    saveSnapshots: false,
    buildMaps: initBuildMaps(cache, equipMaps),
    ...(gameId === WW && {
      offTuneBuildup: [],
    }),
  };

  ctx.attrMaps = initAttrMaps(ctx.buildMaps);
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
