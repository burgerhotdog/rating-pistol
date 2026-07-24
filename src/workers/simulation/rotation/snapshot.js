import { toMergedObj } from '@/utils';
import { resolveStatSpecs, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';

export const buildSnapshot = (ctx, action, options = {}) => {
  const { runtimeOffset = 0 } = options;
  const snapshot = {
    ...action,
    ctxBuildMap: ctx.buildMaps[action.ownerId],
    ...getBuffMap(ctx, { memberId: action.ownerId, action }),
    runtime: ctx.states.runtime + runtimeOffset,
  };

  if (snapshot.buffSpecs.length) {
    const { buffMap } = getBuffMap(ctx, { memberId: ctx.currId, ignoreSpecs: true })
    snapshot.currBuffMap = buffMap;
  } else if (action.ownerId !== ctx.currId) {
    const statMap = toMergedObj(snapshot.ctxBuildMap, snapshot.buffMap);
    snapshot.value = runFormula(ctx.helpers, action, statMap);
  }

  return snapshot;
};

const toResolvedSpecs = (buffSpecs, sourceMap) => {
  const buffMap = {};
  for (const { buffSpec, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(buffSpec, sourceMap);
    mergeStatMap(buffMap, resolvedStatMap, buffMult);
  }
  return buffMap;
};

export const evaluateSnapshot = (helpers, currId, snapshot, currBuildMap) => {
  const {
    ownerId,
    ctxBuildMap,
    buffMap, buffSpecs,
    currBuffMap = {},
  } = snapshot;

  const buildMap = ownerId === currId
    ? currBuildMap
    : ctxBuildMap;

  const currBuffedMap = toMergedObj(currBuildMap, currBuffMap);
  const statMap = toMergedObj(buildMap, buffMap, toResolvedSpecs(buffSpecs, currBuffedMap));

  return runFormula(helpers, snapshot, statMap);
};
