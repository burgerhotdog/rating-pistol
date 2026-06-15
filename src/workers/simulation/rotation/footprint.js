import { mergeObj, mergeObjs, getAttr } from '@/utils';
import { matchUseOn, matchUseIf } from '../match';

const resolveVariableStatMap = (variableStatMap, sourceStatMap) => {
  const resolved = {};

  for (const statId in variableStatMap) {
    resolved[statId] = 0;
    const args = variableStatMap[statId];

    for (const { attr, offset = 0, step, value, max = Infinity } of args) {
      const attrValue = getAttr(attr, sourceStatMap);
      const mult = Math.max((attrValue - offset) / step, 0);

      resolved[statId] += Math.min(value * mult, max);
    }
  }

  return resolved;
};

const computeBase = (statMap, compressed) => {
  const percentMv = statMap.PERCENT_MV ?? 0;
  const flatMv = statMap.FLAT_MV ?? 0;
  let totalMvPart = 0;

  for (const attr in compressed.mv) {
    const attrValue = getAttr(attr, statMap);
    const mv = compressed.mv[attr] ?? 0;

    totalMvPart += attrValue * (mv + flatMv * compressed.hitCount);
  }

  return totalMvPart * (1 + percentMv) + compressed.flat;
};

const computeBonuses = (statMap, considered, element, enemyStatMap) => {
  const critRate = Math.max(Math.min(getAttr('CR', statMap), 1), 0);
  const critDamage = getAttr('CD', statMap);
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  const dmgTypes = [...considered, ...(element ? [element]: [])];
  let dmgBonusMult = 1 + (statMap['PERCENT_ALL'] ?? 0) + (enemyStatMap['PERCENT_ALL'] ?? 0);
  let ampMult = 1 + (statMap['AMP_ALL'] ?? 0) + (enemyStatMap['AMP_ALL'] ?? 0);

  for (const type of dmgTypes) {
    dmgBonusMult += (statMap[`PERCENT_${type}`] ?? 0) + (enemyStatMap[`PERCENT_${type}`] ?? 0);
    ampMult += (statMap[`AMP_${type}`] ?? 0) + (enemyStatMap[`AMP_${type}`] ?? 0);
  }

  return critMult * dmgBonusMult * ampMult;
};

// Resistance and defence reduction multipliers applied to final damage.
// Uses the game's standard resistance brackets and the character-level def formula.
const computeReductions = (cache, statMap, element, enemyStatMap) => {
  const { MAX_LEVEL, ENEMY_RES } = cache.data.misc;

  const resIgnore = (statMap[`IGNORE_${element}_RES`] ?? 0) + (enemyStatMap[`SHRED_${element}_RES`] ?? 0);
  const totalRes = ENEMY_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  const enemyDef = 8 * (MAX_LEVEL + 10) + 792;
  const defIgnore = (statMap['IGNORE_DEF'] ?? 0) + (enemyStatMap['SHRED_DEF'] ?? 0);
  const defMult = (800 + 8 * MAX_LEVEL) / (800 + 8 * MAX_LEVEL + enemyDef * (1 - defIgnore));

  return resMult * defMult;
};

const getCurrentStatMap = (memberId, memberState, fieldState, baseMap, activeId) => {
  const currentMap = { ...baseMap };
  const memberFieldState = memberId === activeId ? 'active' : 'inactive';

  for (const { stacks, effect } of [
    ...Object.values(memberState[memberId]),
    ...Object.values(fieldState[memberFieldState]),
  ]) {
    const { chance, statMap } = effect;
    if (!statMap) continue;

    for (const statId in statMap) {
      currentMap[statId] ??= 0;
      currentMap[statId] += statMap[statId] * stacks * chance;
    }
  }

  for (const { stacks, effect } of [
    ...Object.values(memberState[memberId]),
    ...Object.values(fieldState[memberFieldState]),
  ]) {
    const { chance, variableStatMap } = effect;
    if (!variableStatMap) continue;

    const resolvedStatMap = resolveVariableStatMap(variableStatMap, currentMap);
    for (const statId in resolvedStatMap) {
      currentMap[statId] ??= 0;
      currentMap[statId] += resolvedStatMap[statId] * stacks * chance;
    }
  }

  return currentMap;
};

export const buildFootprint = (ctx, action, repeatCount = 1) => {
  const { cache, characterId, activeId, memberState, fieldState, enemyState } = ctx;
  const actionOwnerFieldState = activeId === action.ownerId ? 'active' : 'inactive';
  const characterIdFieldState = activeId === characterId ? 'active' : 'inactive';

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

  if (!action.compressedMultipliers) {
    return footprint;
  }

  // Resolve enemyStatMap
  for (const { stacks = 1, effect } of [
    ...(cache.passive.enemy ?? []).map(effect => ({ effect })),
    ...Object.values(enemyState.stat),
  ]) {
    const { chance, statMap } = effect;
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
    if (!matchUseOn(action, effect) || !matchUseIf(action, effect, ctx)) continue;
    const { chance, statMap, variableStatMap } = effect;

    if (statMap) { // Fixed statMap bonuses
      for (const statId in statMap) {
        footprint.fixedEffectStatMap[statId] ??= 0;
        footprint.fixedEffectStatMap[statId] += statMap[statId] * chance * stacks;
      }
    }

    if (variableStatMap) {
      if (effect.ownerId === characterId) { // variableStatMaps that scale off characterId's stats
        footprint.charVariableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else { // variableStatMaps that scale off teammate stats
        const ownerCurrentStatMap = getCurrentStatMap(effect.ownerId, memberState, fieldState, cache.baseMap[effect.ownerId], activeId);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);

        for (const statId in resolvedStatMap) {
          footprint.fixedEffectStatMap[statId] ??= 0;
          footprint.fixedEffectStatMap[statId] += resolvedStatMap[statId] * chance * stacks;
        }
      }
    }
  }

  if (footprint.charVariableEffectSpecs.length) {
    for (const { stacks = 1, effect } of [
      ...(cache.passive[characterId] ?? []).map(effect => ({ effect })),
      ...(cache.passive[characterIdFieldState] ?? []).map(effect => ({ effect })),
      ...Object.values(memberState[characterId]),
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
  // base statMap so evaluateRotationSummary can reconstruct statMapWithEffects.
  if (action.ownerId !== characterId && footprint.charVariableEffectSpecs.length) {
    footprint.ownerBaseStatMap = cache.baseMap[action.ownerId];
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (action.ownerId !== characterId && !footprint.charVariableEffectSpecs.length) {
    footprint.fixed = { damage: 0, healing: 0, shield: 0 };
    const statMap = mergeObjs(cache.baseMap[action.ownerId], ctx.equipMapByMember[action.ownerId], footprint.fixedEffectStatMap);

    for (const element in action.compressedMultipliers) {
      const baseValue = computeBase(statMap, action.compressedMultipliers[element]);

      if (action.type === 'healing') {
        const healingBonus = getAttr('HB', statMap);
        footprint.fixed.healing += baseValue * (1 + healingBonus) * action.times * repeatCount;
      } else if (action.type === 'shield') {
        const shieldBonus = getAttr('SS', statMap);
        footprint.fixed.shield += baseValue * (1 + shieldBonus) * action.times * repeatCount;
      } else {
        const bonuses = computeBonuses(statMap, action.considered, element, footprint.enemyStatMap);
        const reductions = computeReductions(cache, statMap, element, footprint.enemyStatMap);
        footprint.fixed.damage += baseValue * bonuses * reductions * action.times * repeatCount;
      }
    }
  }

  return footprint;
};

export const evaluateFootprint = (footprint, cache, characterId, newCharCompiledStatMap) => {
  const summary = {
    key: footprint.key,
    ownerId: footprint.ownerId,
    skillId: footprint.skillId,
    type: footprint.type,
    considered: footprint.considered,
    damage: 0,
    healing: 0,
    shield: 0,
  };

  if (!footprint.compressedMultipliers) {
    return summary;
  }

  if (footprint.fixed) {
    for (const type in footprint.fixed) {
      summary[type] += footprint.fixed[type];
    }
    return summary;
  }

  // ── Determine the stat map to use as base for this action ────────────────
  // For character actions: newCharCompiledStatMap
  // For teammate actions affected by charVariableEffectSpecs: use teammate's
  // pre-compiled statMap (stored in fixedEffectStatMap already accounts
  // for the teammate's own base — we just need the owner's base to merge with).
  // NOTE: fixedDamage === null only when owner === characterId OR when
  // charVariableEffectSpecs is non-empty. In the latter case owner may differ.
  // For teammate actions with charVariableEffectSpecs, ownerBaseStatMap was
  // stored in the footprint during compileRotation.

  // ── Two-pass variable resolution (mirrors getCurrentStatMap logic) ────────

  // Pass 1: resolve charVariableEffectSpecs using (newCharCompiledStatMap + charConstant)
  // to get the character's "live" stat map at this moment.

  let charCurrentStatMap = newCharCompiledStatMap;

  if (footprint.charVariableEffectSpecs.length) {
    const baseForSource = mergeObj(newCharCompiledStatMap, footprint.charConstantEffectContribsForSource);
    const resolvedPass1 = {};
    for (const { variableStatMap, stacks, chance } of footprint.charVariableEffectSpecs) {
      const r = resolveVariableStatMap(variableStatMap, baseForSource);
      for (const [statId, val] of Object.entries(r)) {
        resolvedPass1[statId] = (resolvedPass1[statId] ?? 0) + val * stacks * chance;
      }
    }
    charCurrentStatMap = mergeObjs(newCharCompiledStatMap, footprint.charConstantEffectContribsForSource, resolvedPass1);
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

  const ownerBaseStatMap = footprint.ownerId === characterId ? newCharCompiledStatMap : footprint.ownerBaseStatMap ?? {};
  const effectStatMap = mergeObjs(footprint.fixedEffectStatMap, charVariableResolved);
  const statMap = mergeObj(ownerBaseStatMap, effectStatMap);

  for (const element in footprint.compressedMultipliers) {
    const baseValue = computeBase(statMap, footprint.compressedMultipliers[element]);

    if (footprint.type === 'healing') {
      const healingBonus = getAttr('HB', statMap);
      summary.healing += baseValue * (1 + healingBonus) * footprint.times * footprint.repeatCount;
    } else if (footprint.type === 'shield') {
      const shieldBonus = getAttr('SS', statMap);
      summary.shield += baseValue * (1 + shieldBonus) * footprint.times * footprint.repeatCount;
    } else {
      const bonuses = computeBonuses(statMap, footprint.considered, element, footprint.enemyStatMap);
      const reductions = computeReductions(cache, statMap, element, footprint.enemyStatMap);
      summary.damage += baseValue * bonuses * reductions * footprint.times * footprint.repeatCount;
    }
  }

  return summary;
};
