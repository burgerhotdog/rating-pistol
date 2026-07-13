import { mergeObj, mergeObjs } from '@/utils';
import { resolveVariableStatMap } from '../utils';
import { matchUse } from '../match';
import { runDamageFormula, runTuneFormula } from './damageFormula';
import { getCurrentEnemyMap, getCurrentStatMap } from './getCurrent';

export const buildTuneFootprints = (ctx) => {
  const enemyMap = getCurrentEnemyMap(ctx);
  const tuneBreakStatMap = getCurrentStatMap(ctx, ctx.onFieldId);
  const tuneBreakFootprint = {
    key: `other:tuneBreak`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: runTuneFormula(ctx.helpers, enemyMap, tuneBreakStatMap),
  };

  const footprints = [tuneBreakFootprint];
  const shifting = ctx.state.tune.shifting;

  // Tune response
  for (const member of Object.values(ctx.cache.member)) {
    if (!('tuneResponse' in member)) continue;
    const { dmgType, element, compressed } = member.tuneResponse;
    if (dmgType !== shifting) continue;

    const responseStatMap = getCurrentStatMap(ctx, member.id);

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

export const buildFootprint = (ctx, action) => {
  if (!action.compressed) return;
  const { memberEffects, fieldEffects } = ctx.state;

  const enemyMap = getCurrentEnemyMap(ctx);
  const ctxBuildMap = ctx.buildMaps[action.ownerId];
  const fixedEffectMap = {};
  const variableEffectSpecs = [];
  const charConstantEffectContribsForSource = {};

  const actionOwnerFieldKey = action.ownerId === ctx.onFieldId ? 'onField' : 'offField';

  const effectStates = [
    ...Object.values(memberEffects[action.ownerId]),
    ...Object.values(fieldEffects[actionOwnerFieldKey]),
  ];

  for (const effectState of effectStates) {
    const { stacks = 1, effect } = effectState;

    if (
      !matchUse(effect, action, action.ownerId, ctx) ||
      'followUpAction' in effect ||
      'intervalAction' in effect ||
      effectState.cooldown
    ) {
      continue;
    }

    const { chance, statMap, variableStatMap } = effect;

    if ('statMap' in effect) { // Fixed statMap bonuses
      for (const [statId, value] of Object.entries(statMap)) {
        fixedEffectMap[statId] ??= 0;
        fixedEffectMap[statId] += value * chance * stacks;
      }
    }

    if ('variableStatMap' in effect) {
      if (effect.ownerId === ctx.currId) { // variableStatMaps that scale off currId's stats
        variableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else { // variableStatMaps that scale off teammate stats
        const ownerCurrentStatMap = getCurrentStatMap(ctx, effect.ownerId, undefined, true);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);

        for (const [statId, value] of Object.entries(resolvedStatMap)) {
          fixedEffectMap[statId] ??= 0;
          fixedEffectMap[statId] += value * chance * stacks;
        }
      }
    }

    if ('useCooldown' in effect) {
      effectState.cooldown = effect.useCooldown;
    }
  }

  if (variableEffectSpecs.length) {
    const currIdFieldKey =
      ctx.currId === ctx.onFieldId
        ? 'onField'
        : 'offField';

    for (const { effect, stacks = 1 } of [
      ...Object.values(memberEffects[ctx.currId]),
      ...Object.values(fieldEffects[currIdFieldKey]),
    ]) {
      const { statMap, chance = 1 } = effect;
      if (!statMap) continue;

      for (const [statId, value] of Object.entries(statMap)) {
        charConstantEffectContribsForSource[statId] ??= 0;
        charConstantEffectContribsForSource[statId] += value * stacks * chance;
      }
    }
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (
    action.ownerId !== ctx.currId &&
    !variableEffectSpecs.length
  ) {
    const statMap = mergeObj(ctxBuildMap, fixedEffectMap);

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
    fixedEffectMap,
    variableEffectSpecs,
    charConstantEffectContribsForSource,
  };
};

export const evaluateFootprint = (helpers, currId, footprint, buildMap) => {
  const {
    key, ownerId, type, dmgType, element, attr, compressed,
    enemyMap, ctxBuildMap, fixedEffectMap,
    variableEffectSpecs, charConstantEffectContribsForSource,
  } = footprint;

  const ownerBuildMap =
    ownerId === currId
      ? buildMap
      : ctxBuildMap;

  const variableEffectMap = {};
  if (variableEffectSpecs.length) {
    const baseForSource = mergeObj(buildMap, charConstantEffectContribsForSource);
    for (const { variableStatMap, stacks, chance } of variableEffectSpecs) {
      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseForSource);
      for (const [statId, value] of Object.entries(resolvedStatMap)) {
        variableEffectMap[statId] ??= 0
        variableEffectMap[statId] += value * stacks * chance;
      }
    }
  }

  const ownerStatMap = mergeObjs(ownerBuildMap, fixedEffectMap, variableEffectMap);

  const value = attr === 'tuneAmp'
    ? runTuneFormula(helpers, enemyMap, ownerStatMap, compressed.mvs['tuneAmp'], element)
    : runDamageFormula(helpers, footprint, enemyMap, ownerStatMap);

  return { key, ownerId, type, dmgType, value };
};
