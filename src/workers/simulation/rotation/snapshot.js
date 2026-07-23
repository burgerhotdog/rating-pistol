import { toMergedObj } from '@/utils';
import { resolveVariableStatMap, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getDebuffMap, getBuffMap } from './getStatMap';

export const buildSnapshot = (ctx, action) => {
  const snapshot = {
    ...action,
    ctxBuildMap: ctx.buildMaps[action.ownerId],
    ...getDebuffMap(ctx, { action }),
    ...getBuffMap(ctx, action.ownerId, { action }),
    runtime: ctx.state.runtime,
  };

  if (snapshot.buffSpecs.length) {
    snapshot.currBuffMap = getBuffMap(ctx, ctx.currId, { ignoreVariable: true }).buffMap;
  } else if (action.ownerId !== ctx.currId) {
    const statMap = toMergedObj(snapshot.debuffMap, snapshot.ctxBuildMap, snapshot.buffMap);
    snapshot.value = runFormula(ctx.helpers, action, statMap);
  }

  return snapshot;
};

const toResolvedSpecs = (buffSpecs, sourceBuffedMap) => {
  const variableBuffMap = {};
  for (const { variableStatMap, mult } of buffSpecs) {
    const resolvedStatMap = resolveVariableStatMap(variableStatMap, sourceBuffedMap);
    mergeStatMap(variableBuffMap, resolvedStatMap, mult);
  }
  return variableBuffMap;
};

export const evaluateSnapshot = (helpers, currId, snapshot, buildMap) => {
  const {
    ownerId,
    ctxBuildMap,
    debuffMap, debuffSpecs = [],
    buffMap, buffSpecs = [],
    currBuffMap = {},
  } = snapshot;

  const currBuffedMap = toMergedObj(buildMap, currBuffMap);

  const statMap = toMergedObj(
    ownerId === currId ? buildMap : ctxBuildMap,
    debuffMap,
    buffMap,
    toResolvedSpecs(debuffSpecs, currBuffedMap),
    toResolvedSpecs(buffSpecs, currBuffedMap)
  );

  return runFormula(helpers, snapshot, statMap);
};
