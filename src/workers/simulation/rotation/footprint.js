import { mergeObj, mergeObjs } from '@/utils';
import { matchUseOn, matchUseIf } from '../match';
import { resolveVariableStatMap } from '../utils';
import { isOnCooldown, setCooldown } from './cooldowns';
import { runDamageFormula } from './damageFormula';
import { getCurrentEnemyMap, getCurrentStatMap } from './getCurrent';

export const buildFootprint = (ctx, action, repeatCount = 1) => {
  const { passive, member } = ctx.cache;
  const { cooldowns, effects, fieldEffects } = ctx.state;

  const actionOwnerFieldState = action.ownerId === ctx.onFieldId ? 'active' : 'inactive';
  const currIdFieldState = ctx.currId === ctx.onFieldId ? 'active' : 'inactive';

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
    ...(passive[action.ownerId] ?? []).map((effect) => ({ effect })),
    ...(passive[actionOwnerFieldState] ?? []).map((effect) => ({ effect })),
    ...Object.values(effects[action.ownerId]),
    ...Object.values(fieldEffects[actionOwnerFieldState]),
  ]) {
    if (!matchUseOn(effect, action) || !matchUseIf(effect, action.ownerId, ctx)) continue;
    if ('followUpAction' in effect || 'intervalAction' in effect) continue;
    if (isOnCooldown(cooldowns, 'use', effect.key)) continue;

    const { chance, statMap, variableStatMap } = effect;

    if ('statMap' in effect) { // Fixed statMap bonuses
      for (const [statId, value] of Object.entries(statMap)) {
        footprint.fixedEffectStatMap[statId] ??= 0;
        footprint.fixedEffectStatMap[statId] += value * chance * stacks;
      }
    }

    if ('variableStatMap' in effect) {
      if (effect.ownerId === ctx.currId) { // variableStatMaps that scale off currId's stats
        footprint.charVariableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else { // variableStatMaps that scale off teammate stats
        const ownerCurrentStatMap = getCurrentStatMap(ctx, effect.ownerId, null, true);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);

        for (const [statId, value] of Object.entries(resolvedStatMap)) {
          footprint.fixedEffectStatMap[statId] ??= 0;
          footprint.fixedEffectStatMap[statId] += value * chance * stacks;
        }
      }
    }

    if ('useCooldown' in effect) {
      setCooldown(cooldowns, 'use', effect.key, effect.useCooldown);
    }
  }

  if (footprint.charVariableEffectSpecs.length) {
    for (const { stacks = 1, effect } of [
      ...(passive[ctx.currId] ?? []).map((effect) => ({ effect })),
      ...(passive[currIdFieldState] ?? []).map((effect) => ({ effect })),
      ...Object.values(effects[ctx.currId]),
      ...Object.values(fieldEffects[currIdFieldState]),
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
  if (action.ownerId !== ctx.currId && footprint.charVariableEffectSpecs.length) {
    footprint.ownerBaseStatMap = mergeObj(member[action.ownerId].baseMap, ctx.equipMaps[action.ownerId]);
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (action.ownerId !== ctx.currId && !footprint.charVariableEffectSpecs.length) {
    const statMap = mergeObjs(member[action.ownerId].baseMap, ctx.equipMaps[action.ownerId], footprint.fixedEffectStatMap);

    const config = { enemyStatMap: footprint.enemyStatMap, repeatCount };
    footprint.fixed = runDamageFormula(ctx.helpers, action, config, statMap);
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
  const value = runDamageFormula(helpers, footprint, config, finalStatMap);

  return { ...summary, value };
};
