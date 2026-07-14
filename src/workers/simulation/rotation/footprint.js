import { mergeObj, mergeObjs, getAttr } from '@/utils';
import { resolveVariableStatMap, mergeStatMap } from '../utils';
import { runDamageFormula, runTuneFormula } from './damageFormula';
import { getEnemyMap, getUsedBuffStates, resolveBuffMap } from './getCurrent';

export const buildTuneFootprints = (ctx) => {
  const enemyMap = getEnemyMap(ctx);
  const onFieldBuildMap = ctx.buildMaps[ctx.onFieldId];
  const onFieldUsedBuffStates = getUsedBuffStates(ctx, ctx.onFieldId);
  const { fixedBuffMap, variableBuffSpecs } = resolveBuffMap(ctx, onFieldUsedBuffStates);
  const onFieldStatMap = mergeObj(onFieldBuildMap, fixedBuffMap);

  const tuneBreakFootprint = {
    key: `other:tuneBreak`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: runTuneFormula(ctx.helpers, enemyMap, onFieldStatMap),
  };

  const footprints = [tuneBreakFootprint];
  const shifting = ctx.state.tune.shifting;

  // Tune response
  for (const member of Object.values(ctx.cache.member)) {
    if (!('tuneResponse' in member)) continue;
    const { dmgType, element, compressed } = member.tuneResponse;
    if (dmgType !== shifting) continue;

    const responseBuildMap = ctx.buildMaps[member.id];
    const responseUsedBuffStates = getUsedBuffStates(ctx, member.id);
    const { fixedBuffMap, variableBuffSpecs } = resolveBuffMap(ctx, responseUsedBuffStates);

    const responseStatMap = mergeObj(responseBuildMap, fixedBuffMap);

    footprints.push({
      key: `${member.id}:tuneResponse`,
      ownerId: member.id,
      type: 'damage',
      dmgType,
      fixed: runTuneFormula(ctx.helpers, enemyMap, responseStatMap, compressed.mvs['tuneAmp'], element),
    });
  }

  return footprints;
};

const getTuneStrainBuff = (ctx, memberId, statMap) => {
  const { tune } = ctx.state;

  if (tune.interfered !== 'tuneStrain') return {};

  const stacks = tune.interferedStacks;
  const tuneBreakBoost = getAttr('tuneBreakBoost', statMap);
  console.log('tbb', tuneBreakBoost, stacks * tuneBreakBoost * 0.0012);
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
