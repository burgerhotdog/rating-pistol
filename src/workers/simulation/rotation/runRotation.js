import { GI, WW } from '@/data';
import { getAttr, toMergedObj } from '@/utils';
import { initStates } from './states';
import { createEventFilter } from './filter';
import { runAction } from './runAction';
import { runEffects } from './runEffects';
import { initPassives } from './states/effects';
import { resolveSnapshot } from './snapshot';

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
    states: initStates(gameId, memberIds),
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
  initPassives(ctx);

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
