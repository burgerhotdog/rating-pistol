import { mergeObj, mergeObjs } from '@/utils';
import { matchUseOn, matchUseIf } from '../match';
import { resolveVariableStatMap } from '../utils';
import { isOnCooldown, setCooldown } from './cooldowns';
import { runDamageFormula } from './damageFormula';
import { getCurrentEnemyMap, getCurrentStatMap } from './getCurrent';

export const buildFootprint = (ctx, action, repeatCount = 1) => {
  const { helpers, cache, currId, onFieldId, state } = ctx;

  const actionOwnerFieldState = action.ownerId === onFieldId ? 'active' : 'inactive';
  const currIdFieldState = currId === onFieldId ? 'active' : 'inactive';

  const footprint = {
    ...action,
    repeatCount,
    // Set below
    enemyStatMap: {},
    fixedEffectStatMap: {},
    charVariableEffectSpecs: [],
    charConstantEffectContribsForSource: {},
    ownerBaseStatMap: null,  // only set for teammate actions with charVariableEffectSpecs
  };

  if (!('compressed' in action)) {
    return footprint;
  }

  // Resolve enemyStatMap
  footprint.enemyStatMap = getCurrentEnemyMap(ctx);

  for (const { stacks = 1, effect } of [
    ...(cache.passive[action.ownerId] ?? []).map((effect) => ({ effect })),
    ...(cache.passive[actionOwnerFieldState] ?? []).map((effect) => ({ effect })),
    ...Object.values(state.effects[action.ownerId]),
    ...Object.values(state.fieldEffects[actionOwnerFieldState]),
  ]) {
    if (!matchUseOn(effect, action) || !matchUseIf(effect, action.ownerId, ctx)) continue;
    if ('followUpAction' in effect || 'intervalAction' in effect) continue;
    if (isOnCooldown(ctx, 'use', effect.key)) continue;

    const { chance, statMap, variableStatMap } = effect;

    if ('statMap' in effect) { // Fixed statMap bonuses
      for (const statId in statMap) {
        footprint.fixedEffectStatMap[statId] ??= 0;
        footprint.fixedEffectStatMap[statId] += statMap[statId] * chance * stacks;
      }
    }

    if ('variableStatMap' in effect) {
      if (effect.ownerId === currId) { // variableStatMaps that scale off currId's stats
        footprint.charVariableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else { // variableStatMaps that scale off teammate stats
        const ownerCurrentStatMap = getCurrentStatMap(ctx, effect.ownerId, null, true);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);

        for (const statId in resolvedStatMap) {
          footprint.fixedEffectStatMap[statId] ??= 0;
          footprint.fixedEffectStatMap[statId] += resolvedStatMap[statId] * chance * stacks;
        }
      }
    }

    if ('useCooldown' in effect) {
      setCooldown(ctx, 'use', effect.key, effect.useCooldown);
    }
  }

  if (footprint.charVariableEffectSpecs.length) {
    for (const { stacks = 1, effect } of [
      ...(cache.passive[currId] ?? []).map((effect) => ({ effect })),
      ...(cache.passive[currIdFieldState] ?? []).map((effect) => ({ effect })),
      ...Object.values(state.effects[currId]),
      ...Object.values(state.fieldEffects[currIdFieldState]),
    ]) {
      const { chance, statMap } = effect;
      if (!statMap) continue;

      for (const statId in statMap) {
        footprint.charConstantEffectContribsForSource[statId] ??= 0;
        footprint.charConstantEffectContribsForSource[statId] += statMap[statId] * stacks * chance;
      }
    }
  }

  // For teammate actions affected by charVariableEffectSpecs, store the owner's
  // base + equip statMap so evaluateFootprint can reconstruct full owner stats.
  if (action.ownerId !== currId && footprint.charVariableEffectSpecs.length) {
    footprint.ownerBaseStatMap = mergeObj(cache.member[action.ownerId].baseMap, ctx.equipMaps[action.ownerId]);
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (action.ownerId !== currId && !footprint.charVariableEffectSpecs.length) {
    const statMap = mergeObjs(cache.member[action.ownerId].baseMap, ctx.equipMaps[action.ownerId], footprint.fixedEffectStatMap);

    const config = { enemyStatMap: footprint.enemyStatMap, repeatCount };
    footprint.fixed = runDamageFormula(helpers, action, config, statMap);
  }

  return footprint;
};

export const evaluateFootprint = (helpers, ctx, footprint, statMap) => {
  const { currId } = ctx;

  const summary = {
    key: footprint.key,
    ownerId: footprint.ownerId,
    type: footprint.type,
    dmgType: footprint.dmgType,
  };

  if (!('compressed' in footprint)) {
    return summary;
  }

  const charVariableResolved = {};
  if (footprint.charVariableEffectSpecs.length) {
    const baseForSource = mergeObj(statMap, footprint.charConstantEffectContribsForSource);

    for (const { variableStatMap, stacks, chance } of footprint.charVariableEffectSpecs) {
      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseForSource);

      for (const [statId, value] of Object.entries(resolvedStatMap)) {
        charVariableResolved[statId] ??= 0
        charVariableResolved[statId] += value * stacks * chance;
      }
    }
  }

  const ownerBaseStatMap = footprint.ownerId === currId ? statMap : footprint.ownerBaseStatMap ?? {};
  const effectStatMap = mergeObj(footprint.fixedEffectStatMap, charVariableResolved);
  const finalStatMap = mergeObj(ownerBaseStatMap, effectStatMap);

  const config = { enemyStatMap: footprint.enemyStatMap, repeatCount: footprint.repeatCount };
  const sum = runDamageFormula(helpers, footprint, config, finalStatMap);

  return { ...summary, [footprint.type]: sum };
};
