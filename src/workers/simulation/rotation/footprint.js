import { mergeObj, mergeObjs } from '@/utils';
import { matchUseOn, matchUseIf } from '../match';
import { resolveVariableStatMap } from '../utils';
import { isOnCooldown, setCooldown } from './cooldowns';
import { damageFormula } from './formula';
import { getCurrentStatMap } from './getCurrentStatMap';

export const buildFootprint = (ctx, action, repeatCount = 1) => {
  const { cache, currId, onFieldId, memberState, fieldState, enemyState, formulaConfig } = ctx;

  const actionOwnerFieldState = action.ownerId === onFieldId ? 'active' : 'inactive';
  const characterIdFieldState = currId === onFieldId ? 'active' : 'inactive';

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
  for (const { stacks = 1, effect } of [
    ...(cache.passive.enemy ?? []).map(effect => ({ effect })),
    ...Object.values(enemyState.stat),
  ]) {
    const { chance = 1, statMap } = effect;
    if (!statMap) continue;

    for (const statId in statMap) {
      footprint.enemyStatMap[statId] ??= 0;
      footprint.enemyStatMap[statId] += statMap[statId] * stacks * chance;
    }
  }

  for (const { stacks = 1, effect } of [
    ...(cache.passive[action.ownerId] ?? []).map(effect => ({ effect })),
    ...(cache.passive[actionOwnerFieldState] ?? []).map(effect => ({ effect })),
    ...Object.values(memberState[action.ownerId]),
    ...Object.values(fieldState[actionOwnerFieldState]),
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
        const ownerCurrentStatMap = getCurrentStatMap(ctx, effect.ownerId);
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
      ...(cache.passive[currId] ?? []).map(effect => ({ effect })),
      ...(cache.passive[characterIdFieldState] ?? []).map(effect => ({ effect })),
      ...Object.values(memberState[currId]),
      ...Object.values(fieldState[characterIdFieldState]),
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
    footprint.ownerBaseStatMap = mergeObj(cache.member[action.ownerId].baseMap, ctx.equipMapByMember[action.ownerId]);
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (action.ownerId !== currId && !footprint.charVariableEffectSpecs.length) {
    const statMap = mergeObjs(cache.member[action.ownerId].baseMap, ctx.equipMapByMember[action.ownerId], footprint.fixedEffectStatMap);

    const config = { ...formulaConfig, enemyStatMap: footprint.enemyStatMap, repeatCount };
    footprint.fixed = damageFormula(action, config, statMap);
  }

  return footprint;
};

export const evaluateFootprint = (ctx, footprint, statMap) => {
  const { currId, formulaConfig } = ctx;

  const summary = {
    key: footprint.key,
    ownerId: footprint.ownerId,
    type: footprint.type,
    dmgType: footprint.dmgType,
  };

  if (!('compressed' in footprint)) {
    return summary;
  }

  // ── Determine the stat map to use as base for this action ────────────────
  // For character actions: newCharCompiledStatMap
  // For teammate actions affected by charVariableEffectSpecs: use teammate's
  // pre-compiled statMap (stored in fixedEffectStatMap already accounts
  // for the teammate's own base — we just need the owner's base to merge with).
  // NOTE: fixedDamage === null only when owner === currId OR when
  // charVariableEffectSpecs is non-empty. In the latter case owner may differ.
  // For teammate actions with charVariableEffectSpecs, ownerBaseStatMap was
  // stored in the footprint during compileRotation.

  // ── Two-pass variable resolution (mirrors getCurrentStatMap logic) ────────

  // Pass 1: resolve charVariableEffectSpecs using (newCharCompiledStatMap + charConstant)
  // to get the character's "live" stat map at this moment.

  let charCurrentStatMap = statMap;

  if (footprint.charVariableEffectSpecs.length) {
    const baseForSource = mergeObj(statMap, footprint.charConstantEffectContribsForSource);
    const resolvedPass1 = {};
    for (const { variableStatMap, stacks, chance } of footprint.charVariableEffectSpecs) {
      const r = resolveVariableStatMap(variableStatMap, baseForSource);
      for (const [statId, val] of Object.entries(r)) {
        resolvedPass1[statId] = (resolvedPass1[statId] ?? 0) + val * stacks * chance;
      }
    }
    charCurrentStatMap = mergeObjs(statMap, footprint.charConstantEffectContribsForSource, resolvedPass1);
  }

  // Pass 2: resolve charVariableEffectSpecs using charCurrentStatMap to get
  // the contribution to the damage stat map.
  const charVariableResolved = {};
  if (footprint.charVariableEffectSpecs.length > 0) {
    for (const { variableStatMap, stacks, chance } of footprint.charVariableEffectSpecs) {
      const r = resolveVariableStatMap(variableStatMap, charCurrentStatMap);
      for (const [statId, val] of Object.entries(r)) {
        charVariableResolved[statId] = (charVariableResolved[statId] ?? 0) + val * stacks * chance;
      }
    }
  }

  const ownerBaseStatMap = footprint.ownerId === currId ? statMap : footprint.ownerBaseStatMap ?? {};
  const effectStatMap = mergeObjs(footprint.fixedEffectStatMap, charVariableResolved);
  const finalStatMap = mergeObj(ownerBaseStatMap, effectStatMap);

  const config = { ...formulaConfig, enemyStatMap: footprint.enemyStatMap, repeatCount: footprint.repeatCount };
  const sum = damageFormula(footprint, config, finalStatMap);

  return { ...summary, [footprint.type]: sum };
};
