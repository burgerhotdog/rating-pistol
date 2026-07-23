import { toMergedObj } from '@/utils';
import { resolveStatSpecs, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';

export const buildSnapshot = (ctx, action) => {
  const snapshot = {
    ...action,
    ctxBuildMap: ctx.buildMaps[action.ownerId],
    ...getBuffMap(ctx, { memberId: action.ownerId, action }),
    runtime: ctx.state.runtime,
  };

  if (snapshot.buffSpecs.length) {
    snapshot.currBuffMap = getBuffMap(ctx, { memberId: ctx.currId, ignoreSpecs: true }).buffMap;
  } else if (action.ownerId !== ctx.currId) {
    const statMap = toMergedObj(snapshot.ctxBuildMap, snapshot.buffMap);
    snapshot.value = runFormula(ctx.helpers, action, statMap);
  }

  return snapshot;
};

const toResolvedSpecs = (buffSpecs, sourceBuffedMap) => {
  const variableBuffMap = {};
  for (const { statSpecs, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(statSpecs, sourceBuffedMap);
    mergeStatMap(variableBuffMap, resolvedStatMap, buffMult);
  }
  return variableBuffMap;
};

export const evaluateSnapshot = (helpers, currId, snapshot, buildMap) => {
  const {
    ownerId,
    ctxBuildMap,
    buffMap, buffSpecs = [],
    currBuffMap = {},
  } = snapshot;

  const currBuffedMap = toMergedObj(buildMap, currBuffMap);

  const statMap = toMergedObj(
    ownerId === currId ? buildMap : ctxBuildMap,
    buffMap,
    toResolvedSpecs(buffSpecs, currBuffedMap)
  );

  return runFormula(helpers, snapshot, statMap);
};
