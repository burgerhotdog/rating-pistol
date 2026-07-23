import { toMergedObj } from '@/utils';
import { resolveVariableStatMap, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getDebuffMap, getBuffMap } from './getStatMap';

export const buildFootprint = (ctx, action) => {
  const footprint = {
    ...action,
    ctxBuildMap: ctx.buildMaps[action.ownerId],
    ...getDebuffMap(ctx, { action }),
    ...getBuffMap(ctx, action.ownerId, { action }),
  };

  if (footprint.buffSpecs.length) {
    footprint.currBuffMap = getBuffMap(ctx, ctx.currId, { ignoreVariable: true }).buffMap;
  } else if (action.ownerId !== ctx.currId) {
    const statMap = toMergedObj(footprint.debuffMap, footprint.ctxBuildMap, footprint.buffMap);
    footprint.fixed = runFormula(ctx.helpers, action, statMap);
  }

  return footprint;
};

const toResolvedSpecs = (buffSpecs, sourceBuffedMap) => {
  const variableBuffMap = {};
  for (const { variableStatMap, mult } of buffSpecs) {
    const resolvedStatMap = resolveVariableStatMap(variableStatMap, sourceBuffedMap);
    mergeStatMap(variableBuffMap, resolvedStatMap, mult);
  }
  return variableBuffMap;
};

export const evaluateFootprint = (helpers, currId, footprint, buildMap) => {
  const {
    key, ownerId, type, dmgType,
    ctxBuildMap,
    debuffMap, debuffSpecs = [],
    buffMap, buffSpecs = [],
    currBuffMap = {},
  } = footprint;

  const currBuffedMap = toMergedObj(buildMap, currBuffMap);

  const statMap = toMergedObj(
    ownerId === currId ? buildMap : ctxBuildMap,
    debuffMap,
    buffMap,
    toResolvedSpecs(debuffSpecs, currBuffedMap),
    toResolvedSpecs(buffSpecs, currBuffedMap)
  );

  return {
    key,
    ownerId,
    type,
    dmgType,
    value: runFormula(helpers, footprint, statMap),
  };
};
