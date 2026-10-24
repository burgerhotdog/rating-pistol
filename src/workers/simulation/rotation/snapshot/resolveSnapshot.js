import { toMergedObj, resolveBuffSpecs } from '@/utils';
import { getUsedAttrs } from '../formula/solver';
import { resolveElevationSnapshot } from './resolveElevationSnapshot';

function applyAmpScale(value, scale) {
  if (typeof scale !== 'function') {
    return value * scale;
  }

  return (buildMap) => value * scale(buildMap);
}

function getMemoEntry(memo, scaleFlat) {
  let entry = memo.get(scaleFlat);

  if (!entry) {
    entry = {};
    memo.set(scaleFlat, entry);
  }

  return entry;
}

export const resolveSnapshot = (ctx, snapshot) => {
  const { gameId } = ctx.cache;
  const { unresolved } = snapshot;
  if (!unresolved) return;

  if (unresolved.elevation) {
    resolveElevationSnapshot(ctx, snapshot);
    return;
  }

  const {
    memo,
    part,
    ownerId,
    action,
    buffMap,
    buffSpecs,
    specSourceBuffMap,
    formula,
    splitScale = 1,
    dew = 1,
    scaleFlat = 0,
  } = unresolved;

  const scale = unresolved.scale ?? 1;

  const statMapOwnerId = action?.ownerId ?? ownerId;
  const statMapOwnerIdBuildMap = ctx.buildMaps[statMapOwnerId];

  const isSpecIdAction = statMapOwnerId === ctx.specId;

  const applyScale = (value) => applyAmpScale(value * splitScale * dew, scale);

  const partMemo = getMemoEntry(memo, scaleFlat);

  // Can be resolved now
  // Not in spec mode
  if (!ctx.specId) {
    const statMap = toMergedObj(
      statMapOwnerIdBuildMap,
      buffMap,
      { damageFlat: scaleFlat },
    );

    const value = partMemo.value ??= formula(statMap);
    snapshot[part] = applyScale(value);
    return;
  }

  const usedAttrs = unresolved.usedAttrs ?? getUsedAttrs(gameId, action, part);

  // A function scaleFlat is a reaction flat bonus that reads EM and reaction bonus
  // from the tested build, so any spec buff can feed into it
  const usesSpecs = buffSpecs.some(({ specs }) =>
    typeof scaleFlat === 'function' ||
    Object.keys(specs).some((stat) => usedAttrs.has(stat))
  );

  // Can be resolved now
  // Action is not from specId and uses no variable buffs from specId
  if (!isSpecIdAction && !usesSpecs) {
    const statMap = toMergedObj(
      statMapOwnerIdBuildMap,
      buffMap,
      { damageFlat: scaleFlat },
    );

    const value = partMemo.value ??= formula(statMap);
    snapshot[part] = applyScale(value);
    return;
  }

  // Action is from specId but has no variable buffs from specId
  if (!usesSpecs) {
    snapshot[part] = (testBuildMap) => {
      if (partMemo.buildMap !== testBuildMap) {
        const damageFlat = typeof scaleFlat !== 'function'
          ? scaleFlat
          : scaleFlat(testBuildMap);

        const statMap = toMergedObj(
          testBuildMap,
          buffMap,
          { damageFlat },
        );

        partMemo.buildMap = testBuildMap;
        partMemo.value = formula(statMap) * splitScale * dew;
      }

      const value = partMemo.value;

      return typeof scale !== 'function'
        ? value * scale
        : value * scale(testBuildMap);
    };
    return;
  }

  // Action is not from specId but has variable buffs from specId
  if (!isSpecIdAction) {
    const partiallyBuffedMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
    snapshot[part] = (testBuildMap) => {
      if (partMemo.buildMap !== testBuildMap) {
        const testBuffedMap = toMergedObj(testBuildMap, specSourceBuffMap);
        const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
        const damageFlat = typeof scaleFlat !== 'function'
          ? scaleFlat
          : scaleFlat(testBuildMap);

        const statMap = toMergedObj(
          partiallyBuffedMap,
          resolvedBuffs,
          { damageFlat },
        );

        partMemo.buildMap = testBuildMap;
        partMemo.value = formula(statMap) * splitScale * dew;
      }

      const value = partMemo.value;

      return typeof scale !== 'function'
        ? value * scale
        : value * scale(testBuildMap);
    };
    return;
  }

  // Action is from specId and has variable buffs from specId
  snapshot[part] = (testBuildMap) => {
    if (partMemo.buildMap !== testBuildMap) {
      const testBuffedMap = toMergedObj(testBuildMap, specSourceBuffMap);
      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
      const damageFlat = typeof scaleFlat !== 'function'
        ? scaleFlat
        : scaleFlat(testBuildMap);

      const statMap = toMergedObj(
        testBuildMap,
        buffMap,
        resolvedBuffs,
        { damageFlat },
      );

      partMemo.buildMap = testBuildMap;
      partMemo.value = formula(statMap) * splitScale * dew;
    }

    const value = partMemo.value;

    return typeof scale !== 'function'
      ? value * scale
      : value * scale(testBuildMap);
  };
};
