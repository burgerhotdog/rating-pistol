import { toMergedObj, resolveBuffSpecs } from '@/utils';
import { getUsedAttrs } from '../formula/solver';
import { resolveElevationSnapshot } from './resolveElevationSnapshot';

export const resolveSnapshot = (ctx, snapshot) => {
  const { gameId } = ctx.cache;
  const { unresolved } = snapshot;
  if (!unresolved) return;

  if (unresolved.elevation) {
    resolveElevationSnapshot(ctx, snapshot);
    return;
  }

  const { memo, ownerId, action, buffMap, buffSpecs, specSourceBuffMap, formula, splitScale = 1 } = unresolved;
  const scale = unresolved.scale ?? 1;

  const statMapOwnerId = action?.ownerId ?? ownerId;
  const statMapOwnerIdBuildMap = ctx.buildMaps[statMapOwnerId];

  const isSpecIdAction = statMapOwnerId === ctx.specId;

  for (const part of unresolved.parts) {
    // Can be resolved now
    // Not in spec mode
    if (!ctx.specId) {
      const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      const value = memo[part] ??= formula(statMap, part);
      snapshot[part] = applyScale(value * splitScale, scale);
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
      const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      const value = memo[part] ??= formula(statMap, part);
      snapshot[part] = applyScale(value * splitScale, scale);
      continue;
    }

    // Action is from specId but has no variable buffs from specId
    if (!usesSpecs) {
      snapshot[part] = (testBuildMap) => {
        if (memo[part]?.buildMap !== testBuildMap) {
          const statMap = toMergedObj(testBuildMap, buffMap);
          memo[part] = {
            buildMap: testBuildMap,
            value: formula(statMap, part) * splitScale,
          };
        }

        const value = memo[part].value;
        if (typeof scale !== 'function') {
          return value * scale;
        }
        return value * scale(testBuildMap);
      };
      continue;
    }

    // Action is not from specId but has variable buffs from specId
    if (!isSpecIdAction) {
      const partiallyBuffedMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      snapshot[part] = (testBuildMap) => {
        if (memo[part]?.buildMap !== testBuildMap) {
          const testBuffedMap = toMergedObj(testBuildMap, specSourceBuffMap);
          const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
          const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);
          memo[part] = {
            buildMap: testBuildMap,
            value: formula(statMap, part) * splitScale,
          };
        }

        const value = memo[part].value;
        if (typeof scale !== 'function') {
          return value * scale;
        }
        return value * scale(testBuildMap);
      };
      continue;
    }

    // Action is from specId and has variable buffs from specId
    snapshot[part] = (testBuildMap) => {
      if (memo[part]?.buildMap !== testBuildMap) {
        const testBuffedMap = toMergedObj(testBuildMap, specSourceBuffMap);
        const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
        const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);
        memo[part] = {
          buildMap: testBuildMap,
          value: formula(statMap, part) * splitScale,
        };
      }

      const value = memo[part].value;
      if (typeof scale !== 'function') {
        return value * scale;
      }
      return value * scale(testBuildMap);
    };
  }
};

function applyScale(value, scale) {
  if (typeof scale !== 'function') {
    return value * scale;
  }
  return (buildMap) => value * scale(buildMap);
}

