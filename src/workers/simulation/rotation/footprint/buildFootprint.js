import { mergeObj, mergeObjs, getAttr } from '@/utils';
import { resolveVariableStatMap, mergeStatMap } from '../../utils';
import { getEnemyMap, resolveBuffMap } from '../getCurrent';
import { runFormula } from '../formula';
import { buildNegativeStatusFootprint } from './negativeStatus';
import { matchUseFilter } from '../filter';

const getUsedBuffStates = (ctx, memberId, action = {}) => {
  const { memberEffects, fieldEffects } = ctx.state;
  const field = ctx.getField(memberId);
  const effectStates = [
    ...Object.values(memberEffects[memberId]),
    ...Object.values(fieldEffects[field]),
  ];

  return effectStates
    .filter(({ cooldown, effect }) =>
      ('statMap' in effect || 'variableStatMap' in effect) &&
      !cooldown &&
      matchUseFilter({ effect, action, ctx }));
};

const getTuneStrainBuff = (ctx, memberId, statMap) => {
  const { tune } = ctx.state;
  if (tune.interfered !== 'tuneStrain') return {};

  const stacks = tune.interferedStacks;
  const tuneBreakBoost = getAttr('tuneBreakBoost', statMap);
  return { ['totalDmg%']: stacks * tuneBreakBoost * 0.0012 };
};

export const buildFootprint = (ctx, spec) => {
  const enemyMap = getEnemyMap(ctx);
  if (spec.type === 'negativeStatus') {
    return buildNegativeStatusFootprint(ctx, enemyMap, spec.statusState);
  };

  const { action } = spec;
  const buildMap = ctx.buildMaps[action.ownerId];
  const { fixedBuffMap, variableBuffSpecs } = resolveBuffMap(ctx, action.ownerId, action);
  const tuneStrainBuff = getTuneStrainBuff(ctx, action.ownerId, mergeObj(buildMap, fixedBuffMap));
  mergeStatMap(fixedBuffMap, tuneStrainBuff);

  const currBuffMap = {};
  if (variableBuffSpecs.length) {
    for (const { effect, stacks } of getUsedBuffStates(ctx, ctx.currId)) {
      const { statMap, chance = 1 } = effect;
      if (!statMap) continue;
      mergeStatMap(currBuffMap, statMap, stacks * chance);
    }
  }

  const canResolveNow =
    action.ownerId !== ctx.currId &&
    !variableBuffSpecs.length;

  if (!canResolveNow) {
    return {
      ...action,
      enemyMap,
      ctxBuildMap: buildMap,
      fixedBuffMap,
      variableBuffSpecs,
      currBuffMap,
    };
  }

  const statMap = mergeObj(buildMap, fixedBuffMap);
  return {
    ...action,
    fixed: runFormula(ctx.helpers, action, enemyMap, statMap),
  };
};

export const evaluateFootprint = (helpers, currId, footprint, buildMap) => {
  const {
    key, ownerId, type, dmgType,
    enemyMap,
    ctxBuildMap,
    fixedBuffMap,
    variableBuffSpecs, currBuffMap,
    tuneBreaksPerLoop = 1,
  } = footprint;

  const ownerBuildMap =
    ownerId === currId
      ? buildMap
      : ctxBuildMap;

  const variableBuffMap = {};
  if (variableBuffSpecs.length) {
    const baseForSource = mergeObj(buildMap, currBuffMap);
    for (const { variableStatMap, mult } of variableBuffSpecs) {
      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseForSource);
      mergeStatMap(variableBuffMap, resolvedStatMap, mult);
    }
  }

  const ownerStatMap = mergeObjs(ownerBuildMap, fixedBuffMap, variableBuffMap);

  const value = runFormula(helpers, footprint, enemyMap, ownerStatMap) * tuneBreaksPerLoop;

  return { key, ownerId, type, dmgType, value };
};
