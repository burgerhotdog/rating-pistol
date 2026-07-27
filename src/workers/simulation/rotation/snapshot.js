import { toMergedObj } from '@/utils';
import { resolveStatSpecs, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';

const snapshotParts = ['damage', 'healing', 'shield'];

const toResolvedSpecs = (buffSpecs, sourceMap) => {
  const buffMap = {};
  for (const { buffSpec, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(buffSpec, sourceMap);
    mergeStatMap(buffMap, resolvedStatMap, buffMult);
  }
  return buffMap;
};

export const buildSnapshot = (ctx, action, options = {}) => {
  const { cache, currId } = ctx;
  const { runtimeOffset = 0 } = options;

  const snapshot = {
    key: action.key,
    ownerId: action.ownerId,
    type: action.type,
    dmgType: action.dmgType,
    runtime: ctx.states.runtime + runtimeOffset,
  };

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: action.ownerId, action });
  const currBuffMap = buffSpecs.length
    ? getBuffMap(ctx, { memberId: currId, ignoreSpecs: true })
    : null;

  const statMap = (action.ownerId !== currId && !currBuffMap)
    ? toMergedObj(ctx.buildMaps[action.ownerId], buffMap)
    : null;

  for (const part of snapshotParts) {
    if (!(part in action)) continue;

    if (statMap) {
      snapshot[part] = runFormula(cache.gameId, part, action, statMap);
    } else {
      snapshot[part] = (currBuildMap) => {
        const buildMap = action.ownerId === currId
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
