import { matchUseOn, matchUseIf } from '../match';
import { CONSTANTS } from '../constants';

const mergeObj = (a, b) => {
  const result = { ...a };

  for (const key in b) {
    result[key] = (result[key] ?? 0) + b[key];
  }

  return result;
};

const mergeObjs = (...objects) => {
  const result = {};

  for (const obj of objects) {
    for (const key in obj) {
      result[key] = (result[key] ?? 0) + obj[key];
    }
  }

  return result;
};

const resolveAttr = (attr, statMap) => {
  const baseValue = statMap[`BASE_${attr}`];
  const percentValue = statMap[`PERCENT_${attr}`] ?? 0;
  const flatValue = statMap[`FLAT_${attr}`] ?? 0;

  if (baseValue === undefined) {
    return percentValue;
  }

  return baseValue * (1 + percentValue) + flatValue;
};

const resolveVariableStatMap = (variableStatMap, sourceStatMap) => {
  const resolved = {};

  for (const statId in variableStatMap) {
    resolved[statId] = 0;
    const args = variableStatMap[statId];

    for (const { attr, offset = 0, step, value, max = Infinity } of args) {
      const attrValue = resolveAttr(attr, sourceStatMap);
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
    const attrValue = resolveAttr(attr, statMap);
    const mv = compressed.mv[attr] ?? 0;

    totalMvPart += attrValue * (mv + flatMv * compressed.hitCount);
  }

  return totalMvPart * (1 + percentMv) + compressed.flat;
};

const computeBonuses = (statMap, considered, element, enemyStatMap) => {
  const critRate = Math.max(Math.min(resolveAttr('CR', statMap), 1), 0);
  const critDamage = resolveAttr('CD', statMap);
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
const computeReductions = (gameId, statMap, element, enemyStatMap) => {
  const { MAX_LEVEL, ENEMY_RES } = CONSTANTS[gameId];

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

const getCurrentStatMap = (memberId, effectTrackers, compiledStatMap, activeId) => {
  const baseStats = { ...compiledStatMap[memberId] };
  const activeTracker = activeId === memberId ? effectTrackers.active : effectTrackers.inactive;

  function addConstantEffectStats(trackerMap) {
    for (const { stacks, effect } of Object.values(trackerMap)) {
      const { statMap } = effect;
      if (!statMap) continue;

      for (const [stat, value] of Object.entries(statMap)) {
        baseStats[stat] ??= 0;
        baseStats[stat] += value * stacks;
      }
    }
  }

  addConstantEffectStats(effectTrackers.byMember[memberId]);
  addConstantEffectStats(activeTracker);

  function addVariableEffectStats(trackerMap) {
    for (const { stacks, effect } of Object.values(trackerMap)) {
      const { variableStatMap } = effect;
      if (!variableStatMap) continue;

      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseStats);
      for (const [stat, value] of Object.entries(resolvedStatMap)) {
        baseStats[stat] ??= 0;
        baseStats[stat] += value * stacks;
      }
    }
  }

  addVariableEffectStats(effectTrackers.byMember[memberId]);
  addVariableEffectStats(activeTracker);

  return baseStats;
};

export const buildFootprint = (ctx, {
  action,
  effectTrackers,
  activeId,
  compiledStatMap,
  characterId,
  repeatCount = 1,
}) => {
  const { gameId, cache } = ctx;

  const footprint = {
    key: action.key,
    ownerId: action.ownerId,
    skillId: action.skillId,
    type: action.type,
    element: action.element,
    times: action.times,
    considered: action.considered,
    compressedMultipliers: action.compressedMultipliers,
    repeatCount,
    fixedDamage: 0,
    fixedHealing: 0,
    // Set below
    ownerBaseStatMap: null,  // only set for teammate actions with charVariableEffectSpecs
    constantEffectContribs: {},
    fixedVariableContribs: {},
    charVariableEffectSpecs: [],
    charConstantEffectContribsForSource: {},
    enemyStatMap: {},
  };

  // This footprint does nothing
  if (!action.compressedMultipliers) {
    return footprint;
  }

  // Build enemy stat map snapshot
  const enemyStatMap = {};

  // Passive effects
  for (const member in cache.link) {
    const { passive } = cache.link[member];
    if (!passive.enemy) continue;

    for (const effect of passive.enemy) {
      const { statMap, chance } = effect;
      if (!statMap) continue;

      for (const stat in statMap) {
        enemyStatMap[stat] ??= 0;
        enemyStatMap[stat] += statMap[stat] * chance;
      }
    }
  }

  // Active effects
  for (const effectKey in effectTrackers.enemy) {
    const { stacks, effect } = effectTrackers.enemy[effectKey];
    if (!effect.statMap) continue;

    for (const statId in effect.statMap) {
      enemyStatMap[statId] ??= 0;
      enemyStatMap[statId] += effect.statMap[statId] * stacks;
    }
  }
  footprint.enemyStatMap = enemyStatMap;

  // Classify effect statMap contributions
  // constantEffectContribs — flat stat boosts that don't depend on any character's variable stats (same for every build, resolved immediately)
  // fixedVariableContribs — teammate variable effects whose owner's stats are already fixed, so they can also be pre-resolved now
  // charVariableEffectSpecs — the character's own variable effects that scale off their stats, so they must be re-evaluated per artifact build
  const constantEffectContribs = {};
  const fixedVariableContribs = {};
  const charVariableEffectSpecs = [];

  const passiveEffects = [];
  for (const memberId in cache.link) {
    passiveEffects.push(...(cache.link[memberId].passive[action.ownerId] ?? []));
  }

  const effectsToEval = [
    ...passiveEffects.map(effect => ({ effect })),
    ...Object.values(activeId === action.ownerId ? effectTrackers.active : effectTrackers.inactive),
    ...Object.values(effectTrackers.byMember[action.ownerId]),
  ];

  for (const { stacks = 1, effect } of effectsToEval) {
    if (!matchUseOn(action, effect) || !matchUseIf(action, effect, ctx)) continue;

    const effectScale = effect.chance * stacks;

    if (effect.statMap) {
      for (const [stat, value] of Object.entries(effect.statMap)) {
        constantEffectContribs[stat] ??= 0;
        constantEffectContribs[stat] += value * effectScale;
      }
    }

    if (effect.variableStatMap) {
      if (effect.owner === characterId) {
        // Must be re-evaluated per artifact — record the spec
        charVariableEffectSpecs.push({ variableStatMap: effect.variableStatMap, stacks, chance: effect.chance });
      } else {
        // Teammate's variable effect: owner's statMap is fixed, pre-resolve now
        const ownerCurrentStatMap = getCurrentStatMap(effect.owner, effectTrackers, compiledStatMap, activeId);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);
        for (const [stat, value] of Object.entries(resolvedStatMap)) {
          fixedVariableContribs[stat] ??= 0;
          fixedVariableContribs[stat] += value * effectScale;
        }
      }
    }
  }

  footprint.constantEffectContribs = constantEffectContribs;
  footprint.fixedVariableContribs = fixedVariableContribs;
  footprint.charVariableEffectSpecs = charVariableEffectSpecs;

  // ── charConstantEffectContribsForSource ───────────────────────────────────
  // Mirrors the first (constant) pass of getCurrentStatMap for the character.
  // Used as the base statMap when resolving charVariableEffectSpecs in
  // evaluateRotationSummary, so that variable effects depending on the
  // character's own stat-scaled buffs are computed correctly.
  if (charVariableEffectSpecs.length > 0) {
    const charConstant = {};

    function addConstantFromMap(trackerMap) {
      for (const { stacks, effect } of Object.values(trackerMap)) {
        const { statMap, chance = 1 } = effect;
        if (!statMap) continue;

        for (const [statId, value] of Object.entries(statMap)) {
          charConstant[statId] ??= 0;
          charConstant[statId] += value * stacks * chance;
        }
      }
    }

    addConstantFromMap(effectTrackers.byMember[characterId]);
    addConstantFromMap(activeId === characterId ? effectTrackers.active : effectTrackers.inactive);

    // Also include passive effects (weapon passives, innate buffs) which never
    // enter tracker maps but do contribute to the character's constant stat base.
    for (const effect of Object.values(cache.effect[characterId])) {
      if (!effect.isPassive || !effect.statMap) continue;
      const { statMap, chance = 1 } = effect;
      for (const [statId, value] of Object.entries(statMap)) {
        charConstant[statId] = (charConstant[statId] ?? 0) + value * chance;
      }
    }

    footprint.charConstantEffectContribsForSource = charConstant;
  }

  // For teammate actions affected by charVariableEffectSpecs, store the owner's
  // base statMap so evaluateRotationSummary can reconstruct statMapWithEffects.
  if (action.ownerId !== characterId && charVariableEffectSpecs.length > 0) {
    footprint.ownerBaseStatMap = compiledStatMap[action.ownerId];
  }

  // ── Pre-compute fixed damage for teammate actions ────────────────────
  if (action.ownerId !== characterId && charVariableEffectSpecs.length === 0) {
    const ownerStatMap = compiledStatMap[action.ownerId];
    const effectStatMap = mergeObj(constantEffectContribs, fixedVariableContribs);
    const statMapWithEffects = mergeObj(ownerStatMap, effectStatMap);

    // per element in compressed
    for (const element in action.compressedMultipliers) {
      const compressed = action.compressedMultipliers[element];

      const baseValue = computeBase(statMapWithEffects, compressed);

      if (action.type === 'healing') {
        const healingBonus = resolveAttr('HB', statMapWithEffects);
        footprint.fixedHealing += baseValue * (1 + healingBonus) * action.times * repeatCount;
      } else {
        const bonuses = computeBonuses(statMapWithEffects, action.considered, element, enemyStatMap);
        const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
        footprint.fixedDamage += baseValue * bonuses * reductions * action.times * repeatCount;
      }
    }
  }

  return footprint;
};

export const evaluateFootprint = (footprint, gameId, characterId, newCharCompiledStatMap) => {
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

  const {
    times,
    repeatCount,
    constantEffectContribs,
    fixedVariableContribs,
    charVariableEffectSpecs,
    charConstantEffectContribsForSource,
    enemyStatMap,
  } = footprint;

  if (!footprint.compressedMultipliers) {
    return summary;
  }

  if (footprint.fixedDamage) {
    summary.damage = footprint.fixedDamage;
    return summary;
  }

  if (footprint.fixedHealing) {
    summary.healing = footprint.fixedHealing;
    return summary;
  }

  if (footprint.fixedShield) {
    summary.shield = footprint.fixedShield;
    return summary;
  }

  // ── Determine the stat map to use as base for this action ────────────────
  // For character actions: newCharCompiledStatMap
  // For teammate actions affected by charVariableEffectSpecs: use teammate's
  // pre-compiled statMap (stored in constantEffectContribs already accounts
  // for the teammate's own base — we just need the owner's base to merge with).
  // NOTE: fixedDamage === null only when owner === characterId OR when
  // charVariableEffectSpecs is non-empty. In the latter case owner may differ.
  const isCharAction = footprint.ownerId === characterId;
  // For teammate actions with charVariableEffectSpecs, ownerBaseStatMap was
  // stored in the footprint during compileRotation.
  const ownerBaseStatMap = isCharAction ? newCharCompiledStatMap : footprint.ownerBaseStatMap ?? {};

  // ── Two-pass variable resolution (mirrors getCurrentStatMap logic) ────────

  // Pass 1: resolve charVariableEffectSpecs using (newCharCompiledStatMap + charConstant)
  // to get the character's "live" stat map at this moment.
  let charCurrentStatMap = newCharCompiledStatMap;
  if (charVariableEffectSpecs.length > 0) {
    const baseForSource = mergeObj(newCharCompiledStatMap, charConstantEffectContribsForSource);
    const resolvedPass1 = {};
    for (const { variableStatMap, stacks, chance } of charVariableEffectSpecs) {
      const r = resolveVariableStatMap(variableStatMap, baseForSource);
      for (const [statId, val] of Object.entries(r)) {
        resolvedPass1[statId] = (resolvedPass1[statId] ?? 0) + val * stacks * chance;
      }
    }
    charCurrentStatMap = mergeObjs(newCharCompiledStatMap, charConstantEffectContribsForSource, resolvedPass1);
  }

  // Pass 2: resolve charVariableEffectSpecs using charCurrentStatMap to get
  // the contribution to the damage stat map.
  const charVariableResolved = {};
  if (charVariableEffectSpecs.length > 0) {
    for (const { variableStatMap, stacks, chance } of charVariableEffectSpecs) {
      const r = resolveVariableStatMap(variableStatMap, charCurrentStatMap);
      for (const [statId, val] of Object.entries(r)) {
        charVariableResolved[statId] = (charVariableResolved[statId] ?? 0) + val * stacks * chance;
      }
    }
  }

  const effectStatMap = mergeObjs(constantEffectContribs, fixedVariableContribs, charVariableResolved);
  const statMapWithEffects = mergeObj(ownerBaseStatMap, effectStatMap);

  // per element in compressed
  for (const element in footprint.compressedMultipliers) {
    const compressed = footprint.compressedMultipliers[element];

    const baseValue = computeBase(statMapWithEffects, compressed);

    if (footprint.type === 'healing') {
      const healingBonus = resolveAttr('HB', statMapWithEffects);
      summary.healing = baseValue * (1 + healingBonus) * times * repeatCount;
      return summary;
    } else {
      const bonuses = computeBonuses(statMapWithEffects, footprint.considered, element, enemyStatMap);
      const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
      summary.damage = baseValue * bonuses * reductions * times * repeatCount;
      return summary;
    }
  }
};