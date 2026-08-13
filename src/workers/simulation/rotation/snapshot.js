import { toMergedObj } from '@/utils';
import { resolveStatSpecs, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';

const snapshotParts = ['damage', 'healing', 'shield'];

const toResolvedSpecs = (buffSpecs, sourceMap) => {
  const buffMap = {};
  for (const { specs, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(specs, sourceMap);
    mergeStatMap(buffMap, resolvedStatMap, buffMult);
  }
  return buffMap;
};

export const buildSnapshot = (ctx, action, options = {}) => {
  const { cache, states } = ctx;
  const { runtimeOffset = 0 } = options;

  const snapshot = {
    id: action.id,
    name: action.name,
    ownerId: action.ownerId,
    category: action.category,
    type: action.type,
    field: states.getField(action.ownerId),
    runtime: states.runtime + runtimeOffset,
    ...(action.damage &&
      { damageType: action.damage.type }),
    ...(action.hitOffsets &&
      { hitOffsets: action.hitOffsets }),
  };

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: action.ownerId, action });

  for (const part of snapshotParts) {
    if (!action[part]) continue;

    if (!ctx.specId || (action.ownerId !== ctx.specId && !buffSpecs.length)) {
      const statMap = toMergedObj(ctx.buildMaps[action.ownerId], buffMap);
      snapshot[part] = runFormula(cache.gameId, part, action, statMap);
    } else {
      const currBuffMap = buffSpecs.length
        ? getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true })
        : null;

      snapshot[part] = (currBuildMap) => {
        const buildMap =
          action.ownerId === ctx.specId
            ? currBuildMap
            : ctx.buildMaps[action.ownerId];

        const currBuffedMap = toMergedObj(currBuildMap, currBuffMap);

        const statMap = toMergedObj(buildMap, buffMap, toResolvedSpecs(buffSpecs, currBuffedMap));
        return runFormula(cache.gameId, part, action, statMap);
      };
    }
  }

  return snapshot;
};
