import { toMergedObj, resolveBuffSpecs } from '@/utils';
import { getUsedAttrs } from '../formula/solver';
import { resolveElevationSnapshot } from './resolveElevationSnapshot';

function applyAmpScale(value, scale) {
  if (typeof scale !== 'function') {
    return value * scale;
  }

  return (buildMap) => value * scale(buildMap);
}

function getPartMemo(memo, part, scaleFlat) {
  const partMemo = memo[part] ??= new Map();

  let entry = partMemo.get(scaleFlat);

  if (!entry) {
    entry = {};
    partMemo.set(scaleFlat, entry);
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

  for (const part of unresolved.parts) {
    const partMemo = getPartMemo(memo, part, scaleFlat);

    // Can be resolved now
    // Not in spec mode
    if (!ctx.specId) {
      const statMap = toMergedObj(
        statMapOwnerIdBuildMap,
        buffMap,
        { damageFlat: scaleFlat },
      );

      const value = partMemo.value ??= formula(statMap, part);
      snapshot[part] = applyScale(value);
      continue;
    }

    const usedAttrs = action
      ? getUsedAttrs(gameId, action, part)
      : new Set([
        'elementalMastery',
        `${snapshot.damageType}ReactionBonus%`,
        `${unresolved.reactionElement}ResReduction%`,
      ]);

    const usesSpecs = buffSpecs.some(({ specs }) =>
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

      const value = partMemo.value ??= formula(statMap, part);
      snapshot[part] = applyScale(value);
      continue;
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
          partMemo.value = formula(statMap, part) * splitScale * dew;
        }

        const value = partMemo.value;

        return typeof scale !== 'function'
          ? value * scale
          : value * scale(testBuildMap);
      };
      continue;
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
          partMemo.value = formula(statMap, part) * splitScale * dew;
        }

        const value = partMemo.value;

        return typeof scale !== 'function'
          ? value * scale
          : value * scale(testBuildMap);
      };
      continue;
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
        partMemo.value = formula(statMap, part) * splitScale * dew;
      }

      const value = partMemo.value;

      return typeof scale !== 'function'
        ? value * scale
        : value * scale(testBuildMap);
    };
  }
};
