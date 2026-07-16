import { mergeObj, mergeObjs, getAttr } from '@/utils';
import { resolveVariableStatMap, mergeStatMap } from '../utils';
import { runDamageFormula, runTuneFormula } from './damageFormula';
import { getEnemyMap, getUsedBuffStates, resolveBuffMap } from './getCurrent';

export const buildTuneFootprint = (ctx, footprintType, memberId, action = {}) => {
  const enemyMap = getEnemyMap(ctx);
  const key = footprintType === 'tuneBreak'
    ? 'other:tuneBreak'
    : footprintType === 'tuneResponse'
      ? `${memberId}:tuneResponse`
      : action.key;

  const ownerId = footprintType === 'tuneBreak'
    ? 'other'
    : memberId;

  const dmgType = footprintType === 'tuneBreak'
    ? 'tuneBreak'
    : action.dmgType;

  const buildMap = ctx.buildMaps[memberId];
  const usedBuffStates = getUsedBuffStates(ctx, memberId);
  const { fixedBuffMap } = resolveBuffMap(ctx, usedBuffStates);
  const tuneStatMap = mergeObj(buildMap, fixedBuffMap);
  const fixed = footprintType === 'tuneBreak'
    ? runTuneFormula(ctx.helpers, enemyMap, tuneStatMap)
    : runTuneFormula(ctx.helpers, enemyMap, tuneStatMap, action.compressed.mvs['tuneAmp'], action.element);

  return {
    key,
    ownerId,
    type: 'damage',
    dmgType,
    fixed,
  };
};

const getTuneStrainBuff = (ctx, memberId, statMap) => {
  const { tune } = ctx.state;
  if (tune.interfered !== 'tuneStrain') return {};

  const stacks = tune.interferedStacks;
  const tuneBreakBoost = getAttr('tuneBreakBoost', statMap);
  return { ['totalDmg%']: stacks * tuneBreakBoost * 0.0012 };
};

export const buildFootprint = (ctx, action, fixedBuffMap, variableBuffSpecs) => {
  if (!action.compressed) return;

  const enemyMap = getEnemyMap(ctx);
  const ctxBuildMap = ctx.buildMaps[action.ownerId];
  const tuneStrainBuff = getTuneStrainBuff(ctx, action.ownerId, mergeObj(ctxBuildMap, fixedBuffMap));
  mergeStatMap(fixedBuffMap, tuneStrainBuff);

  const currBuffMap = {};
  if (variableBuffSpecs.length) {
    for (const [,, { effect, stacks }] of getUsedBuffStates(ctx, ctx.currId)) {
      const { statMap, chance = 1 } = effect;
      if (!statMap) continue;
      mergeStatMap(currBuffMap, statMap, stacks * chance);
    }
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (
    action.ownerId !== ctx.currId &&
    !variableBuffSpecs.length
  ) {
    const statMap = mergeObj(ctxBuildMap, fixedBuffMap);

    const fixed = action.attr === 'tuneAmp'
      ? runTuneFormula(ctx.helpers, enemyMap, statMap, action.compressed.mvs['tuneAmp'], action.element)
      : runDamageFormula(ctx.helpers, action, enemyMap, statMap);

    return {
      ...action,
      fixed,
    };
  }

  return {
    ...action,
    enemyMap,
    ctxBuildMap,
    fixedBuffMap,
    variableBuffSpecs,
    currBuffMap,
  };
};

export const evaluateFootprint = (helpers, currId, footprint, buildMap) => {
  const {
    key, ownerId, type, dmgType, element, attr, compressed,
    enemyMap,
    ctxBuildMap,
    fixedBuffMap,
    variableBuffSpecs, currBuffMap,
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

  const value = attr === 'tuneAmp'
    ? runTuneFormula(helpers, enemyMap, ownerStatMap, compressed.mvs['tuneAmp'], element)
    : runDamageFormula(helpers, footprint, enemyMap, ownerStatMap);

  return { key, ownerId, type, dmgType, value };
};
