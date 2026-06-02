import { CHARACTERS, WEAPONS, SETS, MISC, MVS } from '@/data';
import { resolveRankedValue, compileStatMap, mergeStatMaps, computeTotalStat, toArray, getSetCounts } from '@/utils';

const actionsCache = new Map();
const normalizeEffectsCache = new Map();
const compileStatMapCache = new WeakMap();

const MAX_PROC_DEPTH = 4;

// Combines multiple variableStatMap objects into one, collecting each stat's detail
// objects into an array so they can all be resolved together by resolveVariableStatMap.
const mergeVariableStatMaps = (...maps) => {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, details] of Object.entries(map)) {
      (acc[statId] ??= []).push(details);
    }
    return acc;
  }, {});
};

// Evaluates each variable-stat entry against the current sourceStatMap.
// Each entry scales a stat (statId) proportionally to another stat (source),
// e.g. "gain +2% ATK per 100 DEF above 500". Results are capped at `max`.
const resolveVariableStatMap = (variableStatMap = {}, sourceStatMap = {}) => {
  const resolved = {};
  for (const [statId, detailList] of Object.entries(variableStatMap)) {
    for (const details of detailList) {
      const { source, step, offset = 0, value, max = Infinity } = details;
      const totalStat = computeTotalStat(source, sourceStatMap);
      const mult = Math.max((totalStat - offset) / step, 0);
      const variableStatValue = Math.min(mult * value, max);
      resolved[statId] = (resolved[statId] ?? 0) + variableStatValue;
    }
  }
  return resolved;
};

// Converts an inline action definition embedded in a followUpAction/combo entry into
// a normalized action object (same shape as entries in actionsCache), with mv/flat sums
// resolved at the given rank. Returns null if the proc has no inline action.
const normalizeInlineProcAction = (memberId, effectKey, proc, procIndex, rank = Infinity) => {
  const inline = proc.action;
  if (!inline) return null;

  const cast = toArray(inline.cast);
  const considered = toArray(inline.considered ?? cast);

  let sumMvTimes = 0;
  let sumTimes = 0;
  let sumFlat = 0;

  for (const { mv: rawMv, flat: rawFlat, times = 1 } of toArray(inline.multipliers)) {
    if (rawMv != null) {
      const mv = Array.isArray(rawMv) ? resolveRankedValue(rawMv, rank) : rawMv;
      sumMvTimes += mv * times;
      sumTimes += times;
    }
    if (rawFlat != null) {
      const flat = Array.isArray(rawFlat) ? resolveRankedValue(rawFlat, rank) : rawFlat;
      sumFlat += flat;
    }
  }

  return {
    key: `${effectKey}-proc-${procIndex}`,
    owner: memberId,
    skill: inline.skill ?? 'PROC',
    type: inline.type ?? 'damage',
    element: inline.element,
    cast,
    considered,
    duration: inline.duration ?? (cast.length ? 1000 : 0),
    offset: inline.offset ?? (cast.length ? 500 : 0),
    attr: inline.attr ?? 'ATK',
    hasMultipliers: sumMvTimes > 0 || sumFlat > 0,
    sumMvTimes,
    sumTimes,
    sumFlat,
    times: inline.times ?? 1,
  };
};

// Normalizes a single proc entry (from followUpAction or combo array) into a
// consistent shape with resolved useIf* conditions and a ready inlineAction (if any).
const normalizeProc = (memberId, effectKey, proc, procIndex, rank = Infinity) => ({
  useIfConsidered: proc.useIfConsidered && toArray(proc.useIfConsidered),
  useIfCast: proc.useIfCast && toArray(proc.useIfCast),
  useIfAction: proc.useIfAction && toArray(proc.useIfAction).map(sk => `${memberId}-${sk}`),
  action: toArray(proc.action),
  inlineAction: normalizeInlineProcAction(memberId, effectKey, proc, procIndex, rank),
  times: proc.times ?? 1,
});

// Returns the effect arrays for every set bonus that meets its piece threshold.
const getActiveSetBonuses = (gameId, member) => {
  let setCounts = {};
  if (member.setCounts) {
    setCounts = member.setCounts;
  } else if (member.build?.setCounts) {
    setCounts = member.build.setCounts;
  } else {
    setCounts = getSetCounts(member.build?.equipList ?? []);
  }

  const activeBonuses = [];
  for (const [setId, activePieces] of Object.entries(setCounts)) {
    const setBonuses = SETS[gameId]?.[setId]?.setBonus;
    if (!setBonuses) continue;
    for (const [numPiecesToActivate, setBonusData] of Object.entries(setBonuses)) {
      if (activePieces < Number(numPiecesToActivate)) continue;
      activeBonuses.push(setBonusData);
    }
  }
  return activeBonuses;
};

// Enriches every action in MVS[gameId][memberId] with pre-summed damage multipliers
// (sumMvTimes, sumTimes, sumFlat) at the correct skill level for memberRank.
// Results are cached in actionsCache by memberId.
const normalizeActions = (gameId, memberId, memberRank) => {
  const resolved = {};

  // Determine effective skill level: base max + any rank-unlocked additions
  const maxLevel = gameId === 'zenless-zone-zero' ? 12 : 10;
  const addBySkillId = {};

  const { skillLevelMods = [] } = CHARACTERS[gameId][memberId];
  for (const { rank, skillId, add } of skillLevelMods) {
    if (rank > memberRank) continue;
    addBySkillId[skillId] = add;
  }

  // Sum mv/flat multipliers at the resolved level for each action
  const skillTree = MVS[gameId][memberId];
  for (const [skillId, skill] of Object.entries(skillTree)) {
    const level = maxLevel + (addBySkillId[skillId] ?? 0);

    for (const action of Object.values(skill)) {
      const { key, multipliers } = action;

      let sumFlat = 0;
      let sumMv = 0;
      let sumTimes = 0;
      for (const { mv, flat, times = 1 } of (multipliers ?? [])) {
        if (flat) {
          sumFlat += flat[level-1];
        }
        if (mv) {
          sumMv += mv[level-1] * times;
          sumTimes += times;
        }
      }

      resolved[key] = {
        ...action,
        hasMultipliers: !!action.multipliers,
        sumFlat,
        sumMvTimes: sumMv,
        sumTimes,
        times: 1,
      };
    }
  }

  return resolved;
};

// Converts raw effect definitions from character, weapon, and active set bonuses into
// three look-up structures used at simulation time:
//   castEffectsByAction    — { actionKey: [effectKey, ...] } for effects applied on cast
//   contactEffectsByAction — { actionKey: [effectKey, ...] } for effects applied on hit
//   effectDefinitions      — { effectKey: resolvedEffect } for all effects
const normalizeEffects = (gameId, member) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const castEffectsByAction = {};
  const contactEffectsByAction = {};
  const effectDefinitions = {};

  // Applies a rankModifiers entry on top of an already-resolved effect definition,
  // adjusting duration, maxUses, statMap, variableStatMap, or combo.
  function applyRankModifier(resolved, modifier = {}) {
    const { duration, maxUses, statMap, variableStatMap, combo } = modifier;
    if (duration) resolved.duration += duration;
    if (maxUses) resolved.maxUses += maxUses;
    if (statMap) resolved.statMap = mergeStatMaps(resolved.statMap, statMap);
    if (variableStatMap) {
      resolved.variableStatMap = mergeVariableStatMaps(resolved.variableStatMap, variableStatMap);
    }
    if (combo) {
      resolved.combo.push(
        ...toArray(combo).map((proc, procIndex) => normalizeProc(memberId, resolved.effectKey, proc, 100 + procIndex, rank))
      );
    }
  }

  let effectIndex = 0;
  // Processes a list of raw effects (from character / weapon / set JSON), normalizes
  // each into effectDefinitions, and registers it in castEffectsByAction /
  // contactEffectsByAction based on what actions trigger it.
  function registerEffect(rawEffect, rank = Infinity) {
    const resolved = {};

    const effectKey = `${memberId}-${effectIndex}`;
    resolved.effectKey = effectKey;
    resolved.chance = rawEffect.chance ?? 1;
    resolved.applyCooldown = rawEffect.applyCooldown ?? 0;

    if (rawEffect.removeOnCast) {
      resolved.removeOnCast = toArray(rawEffect.removeOnCast);
    }

    resolved.applyTo = rawEffect.applyTo ?? 'self';
    resolved.maxStacks = rawEffect.maxStacks ?? 1;
    resolved.duration = rawEffect.duration ?? Infinity;
    resolved.maxUses = rawEffect.maxUses ?? Infinity;
    resolved.followUpActionCooldown = rawEffect.followUpActionCooldown ?? 0;

    if (rawEffect.useIfAction) {
      resolved.useIfAction = toArray(rawEffect.useIfAction).map(sk => `${memberId}-${sk}`);
    }

    if (rawEffect.useIfConsidered) {
      resolved.useIfConsidered = toArray(rawEffect.useIfConsidered);
    }

    if (rawEffect.useIfType) {
      resolved.useIfType = toArray(rawEffect.useIfType);
    }

    if (rawEffect.statMap) {
      const resolvedStatMap = {};

      for (const [stat, value] of Object.entries(rawEffect.statMap)) {
        resolvedStatMap[stat] = resolveRankedValue(value, rank);
      }

      resolved.statMap = resolvedStatMap;
    }

    resolved.statusMap = rawEffect.statusMap ?? {};
    resolved.applyIfEnemyStatus = rawEffect.applyIfEnemyStatus ?? null;
    resolved.applyIfInflict = rawEffect.applyIfInflict ?? null;
    resolved.variableStatMap = mergeVariableStatMaps(rawEffect.variableStatMap);
    resolved.followUpAction = toArray(rawEffect.followUpAction).map((proc, procIndex) => normalizeProc(memberId, effectKey, proc, procIndex, rank));
    resolved.combo = toArray(rawEffect.comboAction).map((proc, procIndex) => normalizeProc(memberId, effectKey, proc, 100 + procIndex, rank));
    resolved.intervalAction = toArray(rawEffect.intervalAction).map((proc, procIndex) => normalizeProc(memberId, effectKey, proc, 200 + procIndex, rank));
    resolved.intervalCooldown = rawEffect.intervalCooldown;

    if (rawEffect.rankModifiers) {
      for (const [rankReq, modifier] of Object.entries(rawEffect.rankModifiers)) {
        if (Number(rankReq) <= rank) applyRankModifier(resolved, modifier);
      }
    }

    const applyWhen = rawEffect.applyWhen;
    const applyOnAction = toArray(rawEffect.applyOnAction).map(key => {
      const segments = key.split('-');
      if (segments.length === 3) return key;
      return `${memberId}-${key}`;
    });
    const applyOnType = toArray(rawEffect.applyOnType);
    const applyOnCast = toArray(rawEffect.applyOnCast);
    const applyOnConsidered = toArray(rawEffect.applyOnConsidered);

    if (!applyWhen) {
      // No trigger condition — effect is always active (passive)
      resolved.isPassive = true;
    } else {
      // Walk every action to find which ones trigger this effect, and register
      // it in the appropriate By-Action map (cast or contact).
      const actions = actionsCache.get(memberId);
      const inflictMatch = applyOnType.includes('inflict');
      for (const actionKey in actions) {
        const { type, cast, considered } = actions[actionKey];
        const actionMatch = applyOnAction.includes(actionKey);
        const typeMatch = applyOnType.includes(type);
        const castMatch = cast.some(c => applyOnCast.includes(c));
        const consideredMatch = considered.some(c => applyOnConsidered.includes(c));
        if (actionMatch || castMatch || typeMatch || consideredMatch || inflictMatch) {
          if (applyWhen === 'cast') (castEffectsByAction[actionKey] ??= []).push(effectKey);
          if (applyWhen === 'contact') (contactEffectsByAction[actionKey] ??= []).push(effectKey);
        }
      }
    }

    effectDefinitions[effectKey] = resolved;
    effectIndex++;
  }

  for (const effect of toArray(CHARACTERS[gameId][memberId].effects)) {
    if ((effect.rank ?? 0) > rank) continue;
    registerEffect(effect, rank);
  }

  for (const effect of toArray(WEAPONS[gameId][weaponId].effects)) {
    registerEffect(effect, weaponRank);
  }

  for (const effect of getActiveSetBonuses(gameId, member).flatMap(toArray)) {
    registerEffect(effect);
  }

  return { castEffectsByAction, contactEffectsByAction, effectDefinitions };
};

// ─── Footprint building ───────────────────────────────────────────────────────

/**
 * Build a footprint for a single simulateAction call site.
 *
 * A footprint captures everything needed to recompute the damage without
 * re-running the effect simulation:
 *
 * - For teammate actions with no character variable effects, `fixedDamage` /
 *   `fixedHealing` is pre-computed immediately.
 * - For character actions (or any action affected by charVariableEffectSpecs),
 *   the footprint stores enough data for `evaluateRotationSummary` to replay
 *   the damage math cheaply.
 */
const buildFootprint = ({
  gameId,
  action,
  effectTrackers,
  activeId,
  members,
  allEffectDefinitions,
  characterId,
  repeatCount = 1,
}) => {
  const {
    owner: actionOwner,
    key: actionKey,
    element,
    type,
    considered,
    attr,
    hasMultipliers,
    sumMvTimes,
    sumTimes,
    sumFlat,
    times = 1,
  } = action;

  // Base shape
  const footprint = {
    actionKey,
    owner: actionOwner,
    type,
    element,
    attr,
    sumMvTimes,
    sumTimes,
    sumFlat,
    times,
    considered,
    hasMultipliers,
    repeatCount,
    fixedDamage: null,
    fixedHealing: null,
    // Set below
    ownerBaseStatMap: null,  // only set for teammate actions with charVariableEffectSpecs
    constantEffectContribs: {},
    fixedVariableContribs: {},
    charVariableEffectSpecs: [],
    charConstantEffectContribsForSource: {},
    enemyStatMap: {},
  };

  if (type === 'shield' || type === 'buff' || !hasMultipliers) {
    return footprint;
  }

  // ── Build enemy stat map snapshot ─────────────────────────────────────────
  const enemyStatMap = {};
  for (const [effectKey, { stacks }] of Object.entries(effectTrackers.enemy)) {
    const [effectOwner] = effectKey.split('-');
    const { statMap } = members[effectOwner].effectDefinitions[effectKey];
    for (const stat in statMap) {
      enemyStatMap[stat] = (enemyStatMap[stat] ?? 0) + statMap[stat] * stacks;
    }
  }
  footprint.enemyStatMap = enemyStatMap;

  // ── Classify effect contributions ─────────────────────────────────────────
  // Effects are split into three buckets:
  //   constantEffectContribs   — flat stat boosts, same for every build
  //   fixedVariableContribs    — teammate variable effects (owner stat is fixed)
  //   charVariableEffectSpecs  — character's own variable effects (must be re-resolved per artifact build)
  const constantEffectContribs = {};
  const fixedVariableContribs = {};
  const charVariableEffectSpecs = [];

  // Include passive effects from the owner's own definitions plus all active tracker maps
  const trackersToEval = [
    ...Object.entries(members[actionOwner].effectDefinitions).filter(([, { isPassive }]) => isPassive),
    ...Object.entries(effectTrackers.team),
    ...Object.entries(activeId === actionOwner ? effectTrackers.active : effectTrackers.inactive),
    ...Object.entries(effectTrackers.byMember[actionOwner]),
  ];

  for (const [effectKey, trackerOrPlaceholder] of trackersToEval) {
    const stacks = trackerOrPlaceholder?.stacks ?? 1;
    const {
      useIfAction,
      useIfConsidered,
      useIfType,
      statMap,
      variableStatMap,
      chance = 1,
    } = allEffectDefinitions[effectKey];

    if (useIfAction && !useIfAction.includes(actionKey)) continue;
    if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;
    if (useIfType && !useIfType.includes(type)) continue;

    const effectOwner = effectKey.split('-')[0];
    const effectiveScale = chance * stacks;

    if (statMap && Object.keys(statMap).length > 0) {
      for (const [statId, value] of Object.entries(statMap)) {
        constantEffectContribs[statId] = (constantEffectContribs[statId] ?? 0) + value * effectiveScale;
      }
    }

    if (variableStatMap && Object.keys(variableStatMap).length > 0) {
      if (effectOwner === characterId) {
        // Must be re-evaluated per artifact — record the spec
        charVariableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else {
        // Teammate's variable effect: owner's statMap is fixed, pre-resolve now
        const ownerCurrentStatMap = getCurrentStatMap(effectOwner, effectTrackers, members);
        const resolved = resolveVariableStatMap(variableStatMap, ownerCurrentStatMap);
        for (const [statId, value] of Object.entries(resolved)) {
          fixedVariableContribs[statId] = (fixedVariableContribs[statId] ?? 0) + value * effectiveScale;
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
      for (const [effectKey, { stacks }] of Object.entries(trackerMap)) {
        const effectOwner = effectKey.split('-')[0];
        const effectDef = members[effectOwner].effectDefinitions[effectKey];
        const { statMap: sm = {} } = effectDef;
        for (const [statId, val] of Object.entries(sm)) {
          charConstant[statId] = (charConstant[statId] ?? 0) + val * stacks;
        }
      }
    }

    addConstantFromMap(effectTrackers.byMember[characterId] ?? {});
    addConstantFromMap(effectTrackers.team ?? {});
    addConstantFromMap(effectTrackers.active ?? {});

    footprint.charConstantEffectContribsForSource = charConstant;
  }

  // For teammate actions affected by charVariableEffectSpecs, store the owner's
  // base statMap so evaluateRotationSummary can reconstruct statMapWithEffects.
  if (actionOwner !== characterId && charVariableEffectSpecs.length > 0) {
    footprint.ownerBaseStatMap = members[actionOwner].statMap;
  }

  // ── Pre-compute fixed damage for non-character actions ────────────────────
  if (actionOwner !== characterId && charVariableEffectSpecs.length === 0) {
    const ownerStatMap = members[actionOwner].statMap;
    const effectStatMap = mergeStatMaps(constantEffectContribs, fixedVariableContribs);
    const statMapWithEffects = mergeStatMaps(ownerStatMap, effectStatMap);
    const baseValue = computeBase(statMapWithEffects, attr, sumMvTimes, sumTimes, sumFlat);

    if (type === 'heal') {
      const healingBonus = computeTotalStat('HB', statMapWithEffects);
      footprint.fixedHealing = baseValue * (1 + healingBonus) * times * repeatCount;
    } else {
      const bonuses = computeBonuses(statMapWithEffects, considered, enemyStatMap);
      const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
      footprint.fixedDamage = baseValue * bonuses * reductions * times * repeatCount;
    }
  }

  return footprint;
};

// ─── Damage math (mirrors simulateRotation) ───────────────────────────────────

// Base damage before crits/bonuses/reductions:
//   sumFlat + attr × (sumMvTimes + FLAT_MV × sumTimes) × (1 + PERCENT_MV)
const computeBase = (statMap, attr, sumMvTimes, sumTimes, sumFlat) => {
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  const attrValue = computeTotalStat(attr, statMap);
  return sumFlat + attrValue * (sumMvTimes + flatMv * sumTimes) * (1 + percentMv);
};

// Combined multiplier from crits, damage bonus (PERCENT_*), and amplification (AMP_*).
// dmgTypes is the action's `considered` array — each type adds its own PERCENT/AMP bonus.
const computeBonuses = (statMap, dmgTypes, enemyStatMap) => {
  const critRate = Math.max(Math.min(computeTotalStat('CR', statMap), 1), 0);
  const critDamage = computeTotalStat('CD', statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

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
  const { MAX_LEVEL, ENEMY_RES } = MISC[gameId];

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

// ─── getCurrentStatMap (mirrors simulateRotation) ─────────────────────────────

// Computes a member's effective stat map at the current moment by layering active
// effects on top of their base compiled stat map. Two-pass: constant effects first
// (so variable effects can reference the updated values in pass 2).
const getCurrentStatMap = (memberId, effectTrackers, members) => {
  const baseStats = { ...members[memberId].statMap };

  function addConstantEffectStats(trackerMap) {
    for (const [effectKey, { stacks }] of Object.entries(trackerMap)) {
      const effectOwner = effectKey.split('-')[0];
      const effectDefinition = members[effectOwner].effectDefinitions[effectKey];
      const { statMap = {} } = effectDefinition;
      for (const [statId, val] of Object.entries(statMap)) {
        baseStats[statId] = (baseStats[statId] ?? 0) + val * stacks;
      }
    }
  }

  addConstantEffectStats(effectTrackers.byMember[memberId] ?? {});
  addConstantEffectStats(effectTrackers.team ?? {});
  addConstantEffectStats(effectTrackers.active ?? {});

  function addVariableEffectStats(trackerMap) {
    for (const [effectKey, { stacks }] of Object.entries(trackerMap)) {
      const effectOwner = effectKey.split('-')[0];
      const effectDefinition = members[effectOwner].effectDefinitions[effectKey];
      const { variableStatMap = {} } = effectDefinition;
      const resolvedVariableStatMap = resolveVariableStatMap(variableStatMap, baseStats);
      for (const [statId, val] of Object.entries(resolvedVariableStatMap)) {
        baseStats[statId] = (baseStats[statId] ?? 0) + val * stacks;
      }
    }
  }

  addVariableEffectStats(effectTrackers.byMember[memberId] ?? {});
  addVariableEffectStats(effectTrackers.team ?? {});
  addVariableEffectStats(effectTrackers.active ?? {});

  return baseStats;
};

// ─── Effect application (verbatim from simulateRotation) ─────────────────────

// Returns the current stack count for an enemy status (e.g. Burn, Freeze).
function hasEnemyStatus(statusName, effectTrackers) {
  return effectTrackers.enemyStatuses[statusName]?.stacks ?? 0;
}

// Returns true if any negative status is currently applied to the enemy.
function hasAnyNegativeStatus(gameId, effectTrackers) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  return Object.keys(statuses).some(name => hasEnemyStatus(name, effectTrackers) > 0);
}

// Core effect-application function. For a given action + trigger ('cast' or 'contact'),
// looks up registered effect keys, checks all conditions and cooldowns, then writes
// updated stacks/timers into the relevant tracker maps. Returns the set of effectKeys
// that were actually applied (used to drive combo proc processing).
function applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap = {}, times = 1, trigger = 'cast' }) {
  const { owner: actionOwner, key: actionKey, input } = action;
  const member = members[actionOwner];
  if (!member) return [];

  if (trigger === 'cast' && input) {
    const removeFromMap = (trackerMap) => {
      for (const effectKey of Object.keys(trackerMap)) {
        const effectOwner = effectKey.split('-')[0];
        if (effectOwner !== actionOwner) continue;
        const effectDef = members[effectOwner]?.effectDefinitions[effectKey];
        if (!effectDef?.removeOnCast) continue;
        if (effectDef.removeOnCast.includes(input)) delete trackerMap[effectKey];
      }
    };
    removeFromMap(effectTrackers.team);
    removeFromMap(effectTrackers.active);
    removeFromMap(effectTrackers.inactive);
    for (const memberMap of Object.values(effectTrackers.byMember)) removeFromMap(memberMap);
  }

  const effectsByAction = trigger === 'contact'
    ? member.contactEffectsByAction
    : member.castEffectsByAction;

  const triggeredEffects = new Set(effectsByAction[actionKey] ?? []);
  const { effectDefinitions } = member;
  if (triggeredEffects.size === 0) return [];

  const memberIds = Object.keys(effectTrackers.byMember);
  const teamSize = memberIds.length;

  const validTargetsById = Object.fromEntries(
    memberIds.map(id => {
      const targets = [id === actionOwner ? 'self' : 'ally'];
      if (members[id].index === 0) targets.push('first');
      if ((members[id].index + 1) % teamSize === members[actionOwner].index) targets.push('next');
      return [id, targets];
    })
  );

  const inflictedStatuses = new Set();
  const appliedSet = new Set();

  function applyEffect(tracker, effect) {
    const { effectKey, maxStacks, duration, maxUses, intervalCooldown } = effectDefinitions[effect];
    const currentStacks = tracker[effectKey]?.stacks ?? 0;
    tracker[effectKey] = {
      stacks: Math.min(currentStacks + times, maxStacks),
      timeRemaining: duration,
      followUpActionRemaining: maxUses,
      ...(intervalCooldown ? { procTimer: tracker[effectKey]?.procTimer ?? intervalCooldown } : {}),
    };
    appliedSet.add(effectKey);
  }

  for (const effect of triggeredEffects) {
    const { applyTo, effectKey, applyCooldown, applyIfEnemyStatus, applyIfInflict } = effectDefinitions[effect];
    if (applyCooldownMap[effectKey]) continue;
    if (applyIfInflict) continue;

    if (applyIfEnemyStatus) {
      const hasStatus = (applyIfEnemyStatus === true || applyIfEnemyStatus === 'ANY')
        ? hasAnyNegativeStatus(gameId, effectTrackers)
        : hasEnemyStatus(applyIfEnemyStatus, effectTrackers) > 0;
      if (!hasStatus) continue;
    }

    if (applyTo === 'team' || applyTo === 'active' || applyTo === 'inactive') {
      applyEffect(effectTrackers[applyTo], effect);
      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    if (applyTo === 'enemy') {
      const { statMap: effectStatMap = {}, statusMap = {} } = effectDefinitions[effect];
      if (Object.keys(effectStatMap).length > 0) applyEffect(effectTrackers.enemy, effect);

      for (const [statusName, stacksToAdd] of Object.entries(statusMap)) {
        const statusDef = MISC[gameId].NEGATIVE_STATUSES?.[statusName];
        if (!statusDef) continue;
        const current = effectTrackers.enemyStatuses[statusName];
        const stacksBefore = current?.stacks ?? 0;
        if (!current) {
          effectTrackers.enemyStatuses[statusName] = {
            stacks: Math.min(stacksToAdd * times, statusDef.maxStacks),
            tickTimer: statusDef.tickInterval,
            ...(statusDef.duration != null ? { duration: statusDef.duration } : {}),
          };
        } else {
          current.stacks = Math.min(current.stacks + stacksToAdd * times, statusDef.maxStacks);
          if (statusDef.refreshOnApply) current.duration = statusDef.duration;
        }
        if ((effectTrackers.enemyStatuses[statusName]?.stacks ?? 0) > stacksBefore) inflictedStatuses.add(statusName);
      }

      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    for (const [id, validTargets] of Object.entries(validTargetsById)) {
      if (validTargets.includes(applyTo)) applyEffect(effectTrackers.byMember[id], effect);
    }
    if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
  }

  for (const effect of triggeredEffects) {
    const { applyTo, effectKey, applyCooldown, applyIfInflict } = effectDefinitions[effect];
    if (!applyIfInflict || !inflictedStatuses.has(applyIfInflict)) continue;
    if (applyCooldownMap[effectKey]) continue;

    if (applyTo === 'team' || applyTo === 'active' || applyTo === 'inactive') {
      applyEffect(effectTrackers[applyTo], effect);
      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    for (const [id, validTargets] of Object.entries(validTargetsById)) {
      if (validTargets.includes(applyTo)) applyEffect(effectTrackers.byMember[id], effect);
    }
    if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
  }

  return [...appliedSet];
}

// Advances (and expires) all active effects by the action's timing window.
// `offset` is used to check expiry (effects expiring before the action mid-point
// are gone), while `duration` is the full advance applied to survivors.
function advanceEffects(effectTrackers, offset, duration) {
  function advanceMap(map) {
    for (const [effectKey, effectData] of Object.entries(map)) {
      if (effectData.timeRemaining - offset <= 0) {
        delete map[effectKey];
      } else {
        effectData.timeRemaining -= duration;
      }
    }
  }
  const { byMember, team, active, inactive, enemy } = effectTrackers;
  advanceMap(team);
  advanceMap(active);
  advanceMap(inactive);
  advanceMap(enemy);
  for (const memberMap of Object.values(byMember)) advanceMap(memberMap);
}

// Decrements all active proc/apply cooldowns by `delta` ms and removes expired ones.
function tickProcCooldowns(procCooldownMap, delta) {
  for (const [cooldownKey, cooldownRemaining] of Object.entries(procCooldownMap)) {
    const nextValue = cooldownRemaining - delta;
    if (nextValue <= 0) delete procCooldownMap[cooldownKey];
    else procCooldownMap[cooldownKey] = nextValue;
  }
}

// Advances enemy status timers (Burn, Freeze, etc.), firing tick-based stack
// consumption and expiring statuses that have run out of duration.
function tickEnemyStatuses(gameId, effectTrackers, elapsed) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  for (const [statusName, statusDef] of Object.entries(statuses)) {
    const state = effectTrackers.enemyStatuses[statusName];
    if (!state) continue;
    if (state.duration !== undefined) {
      state.duration -= elapsed;
      if (state.duration <= 0) { delete effectTrackers.enemyStatuses[statusName]; continue; }
    }
    state.tickTimer -= elapsed;
    while (state.tickTimer <= 0 && state.stacks > 0) {
      if (statusDef.consumesOnTick) {
        state.stacks--;
        if (state.stacks === 0) { delete effectTrackers.enemyStatuses[statusName]; break; }
      }
      state.tickTimer += statusDef.tickInterval;
    }
  }
}

// Decrements `followUpActionRemaining` for all effects that triggered a followUp on
// this action, and removes effects that have exhausted their remaining uses.
function decayProcCounts(members, effectTrackers, action) {
  const { team, active, inactive, enemy, byMember } = effectTrackers;
  const { key: actionKey } = action;

  function decayMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (effectTracker.followUpActionRemaining === Infinity) continue;
      const effectOwner = effectKey.split('-')[0];
      const { useIfAction, followUpAction, intervalAction } = members[effectOwner].effectDefinitions[effectKey];
      if (useIfAction && !useIfAction.includes(actionKey)) continue;
      if (!followUpAction && !intervalAction) effectTracker.followUpActionRemaining -= 1;
      if (effectTracker.followUpActionRemaining <= 0) delete trackerMap[effectKey];
    }
  }

  decayMap(team);
  decayMap(active);
  decayMap(inactive);
  decayMap(enemy);
  for (const map of Object.values(byMember)) decayMap(map);
}

// ─── Unified recursive proc helpers ──────────────────────────────────────────
//
// These three functions handle all proc triggering. They call processAction
// recursively, so proc actions go through the same cast → footprint → contact
// → followUp pipeline as top-level rotation actions. `depth` limits the chain
// length; `onFootprint` is null during the priming pass and a push callback
// during the recording pass.

// Fires combo procs registered on the effects that were applied by the current
// action. Combo procs are immediate (triggered at the moment the effect is applied).
function processComboProcs(appliedEffectKeys, action, ctx, depth, onFootprint) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { members, effectTrackers } = ctx;
  const { key: actionKey, considered, cast } = action;

  for (const effectKey of appliedEffectKeys) {
    const [effectOwner] = effectKey.split('-');
    const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
    if (!effectDef?.combo?.length) continue;

    const stacks = (
      effectTrackers.team[effectKey] ??
      effectTrackers.active[effectKey] ??
      effectTrackers.inactive[effectKey] ??
      effectTrackers.enemy[effectKey] ??
      effectTrackers.byMember[effectOwner]?.[effectKey]
    )?.stacks ?? 1;

    for (const { useIfConsidered, useIfCast, useIfAction, action: procActionIds, inlineAction, times } of effectDef.combo) {
      if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;
      if (useIfCast && !(cast ?? []).some(c => useIfCast.includes(c))) continue;
      if (useIfAction && !useIfAction.includes(actionKey)) continue;

      // Snapshot proc actions before recursing to prevent mid-iteration mutation
      const procActions = [];
      for (const procActionId of procActionIds) {
        const procActionKey = effectOwner + '-' + procActionId;
        const procAction = actionsCache.get(effectOwner)?.[procActionKey];
        if (!procAction) continue;
        procActions.push(procAction);
      }
      if (inlineAction) procActions.push(inlineAction);

      for (const procAction of procActions) {
        processAction(procAction, ctx, depth + 1, onFootprint, stacks * times, times);
      }
    }
  }
}

// Fires action-triggered followUp procs from all active tracker maps.
// These are one-shot or limited-use procs that fire when a matching action occurs,
// as opposed to interval procs which fire on a timer.
function processFollowUpProcs(action, ctx, depth, onFootprint) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { members, effectTrackers, procCooldownMap } = ctx;
  const { key: actionKey, owner: actionOwner, considered, cast, type } = action;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    const entries = Object.entries(trackerMap); // snapshot before recursing
    for (const [effectKey, effectTracker] of entries) {
      if (procCooldownMap[effectKey]) continue;
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;
      if (effectDef.useIfType && !effectDef.useIfType.includes(type)) continue;

      const { followUpAction, followUpActionCooldown } = effectDef;
      if (!followUpAction?.length) continue;

      let procFired = false;
      for (const { useIfConsidered, useIfCast, useIfAction, action: procActionIds, inlineAction, times } of followUpAction) {
        if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;
        if (useIfCast && !(cast ?? []).some(c => useIfCast.includes(c))) continue;
        if (useIfAction && !useIfAction.includes(actionKey)) continue;

        // Snapshot proc actions before recursing to prevent mid-iteration mutation
        const procActions = [];
        for (const procActionId of procActionIds) {
          const procActionKey = effectOwner + '-' + procActionId;
          const procAction = actionsCache.get(effectOwner)?.[procActionKey];
          if (!procAction) continue;
          procActions.push(procAction);
        }
        if (inlineAction) procActions.push(inlineAction);

        // Set cooldown BEFORE recursing so re-entrant calls to processFollowUpProcs
        // (from within the proc action itself) see it as blocked and skip.
        if (followUpActionCooldown > 0) procCooldownMap[effectKey] = followUpActionCooldown;

        for (const procAction of procActions) {
          processAction(procAction, ctx, depth + 1, onFootprint, effectTracker.stacks * times, times);
        }

        procFired = true;
      }

      if (procFired) effectTracker.followUpActionRemaining--;
    }
  }

  processTrackerMap(byMember[actionOwner] ?? {});
  processTrackerMap(team);
  processTrackerMap(active);
  processTrackerMap(inactive);
  processTrackerMap(enemy);
}

// Fires timer-based (interval) procs. Called once per rotation action with
// the action's duration as `elapsed`. Effects fire repeatedly while their timer is <= 0,
// re-arming after each fire by adding intervalCooldown back to the timer.
function processIntervalProcs(ctx, elapsed, depth, onFootprint) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { members, effectTrackers, procCooldownMap } = ctx;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    const entries = Object.entries(trackerMap); // snapshot before recursing
    for (const [effectKey, effectTracker] of entries) {
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;

      const { intervalAction, intervalCooldown } = effectDef;
      if (!intervalAction?.length || !intervalCooldown) continue;
      if (procCooldownMap[effectKey]) continue;

      effectTracker.procTimer -= elapsed;

      while (effectTracker.procTimer <= 0) {
        for (const { action: procActionIds, inlineAction, times } of intervalAction) {
          // Snapshot proc actions before recursing to prevent mid-iteration mutation
          const procActions = [];
          for (const procActionId of procActionIds) {
            const procActionKey = effectOwner + '-' + procActionId;
            const procAction = actionsCache.get(effectOwner)?.[procActionKey];
            if (!procAction) continue;
            procActions.push(procAction);
          }
          if (inlineAction) procActions.push(inlineAction);

          for (const procAction of procActions) {
            processAction(procAction, ctx, depth + 1, onFootprint, effectTracker.stacks * times, times);
          }
        }

        effectTracker.procTimer += intervalCooldown;
        effectTracker.followUpActionRemaining--;
        if (effectTracker.followUpActionRemaining <= 0) {
          delete trackerMap[effectKey];
          break;
        }
      }
    }
  }

  for (const memberMap of Object.values(byMember)) processTrackerMap(memberMap);
  processTrackerMap(team);
  processTrackerMap(active);
  processTrackerMap(inactive);
  processTrackerMap(enemy);
}

// Fires interval procs for effects that were just applied on contact during this action.
// Only processes the supplied `contactApplied` effect keys, with `elapsed = duration - offset`
// representing the remaining window after the contact point.
function processContactIntervalProcs(contactApplied, ctx, elapsed, depth, onFootprint) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { members, effectTrackers, procCooldownMap } = ctx;
  const { byMember, team, active, inactive, enemy } = effectTrackers;
  const appliedSet = new Set(contactApplied);

  function processTrackerMap(trackerMap) {
    const entries = Object.entries(trackerMap); // snapshot before recursing
    for (const [effectKey, effectTracker] of entries) {
      if (!appliedSet.has(effectKey)) continue;
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;

      const { intervalAction, intervalCooldown } = effectDef;
      if (!intervalAction?.length || !intervalCooldown) continue;
      if (procCooldownMap[effectKey]) continue;

      effectTracker.procTimer -= elapsed;

      while (effectTracker.procTimer <= 0) {
        for (const { action: procActionIds, inlineAction, times } of intervalAction) {
          // Snapshot proc actions before recursing to prevent mid-iteration mutation
          const procActions = [];
          for (const procActionId of procActionIds) {
            const procActionKey = effectOwner + '-' + procActionId;
            const procAction = actionsCache.get(effectOwner)?.[procActionKey];
            if (!procAction) continue;
            procActions.push(procAction);
          }
          if (inlineAction) procActions.push(inlineAction);

          for (const procAction of procActions) {
            processAction(procAction, ctx, depth + 1, onFootprint, effectTracker.stacks * times, times);
          }
        }

        effectTracker.procTimer += intervalCooldown;
        effectTracker.followUpActionRemaining--;
        if (effectTracker.followUpActionRemaining <= 0) {
          delete trackerMap[effectKey];
          break;
        }
      }
    }
  }

  for (const memberMap of Object.values(byMember)) processTrackerMap(memberMap);
  processTrackerMap(team);
  processTrackerMap(active);
  processTrackerMap(inactive);
  processTrackerMap(enemy);
}

/**
 * Process a single action through the full simulation pipeline.
 * Called recursively for proc actions (combo, followUp, interval).
 *
 * At depth 0: drives timing, cooldown ticks, and decay (i.e. the main rotation action).
 * At depth > 0: applies effects and records footprints only (proc actions).
 *
 * @param {Object}   action       - Normalized action object from actionsCache
 * @param {Object}   ctx          - Shared simulation context
 * @param {number}   depth        - Current recursion depth (0 = top-level rotation action)
 * @param {Function} onFootprint  - Called with each built footprint; null in priming pass
 * @param {number}   repeatCount  - Damage repeat multiplier (stacks × times for procs)
 * @param {number}   applyTimes   - Stack count to pass to applyEffects for proc actions
 */
function processAction(action, ctx, depth, onFootprint, repeatCount = 1, applyTimes = 1) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { gameId, members, effectTrackers, applyCooldownMap, procCooldownMap, allEffectDefinitions, characterId } = ctx;

  // ── Cast phase: apply cast effects, then fire any combo procs they triggered ──
  const castApplied = depth === 0
    ? applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'cast' })
    : applyEffects({ gameId, action, members, effectTrackers, times: applyTimes, trigger: 'cast' });
  processComboProcs(castApplied, action, ctx, depth, onFootprint);

  // ── Timing (top-level actions only): advance effect timers, fire interval procs ──
  if (depth === 0) {
    const { duration, offset } = action;
    advanceEffects(effectTrackers, offset, duration);
    tickEnemyStatuses(gameId, effectTrackers, duration);
    processIntervalProcs(ctx, duration, depth, onFootprint);
    tickProcCooldowns(procCooldownMap, offset);
    tickProcCooldowns(applyCooldownMap, offset);
  }

  // ── Footprint: snapshot current effect state for evaluateRotationSummary ──
  onFootprint?.(buildFootprint({
    gameId,
    action,
    effectTrackers,
    activeId: ctx.activeId,
    members,
    allEffectDefinitions,
    characterId,
    repeatCount,
  }));

  // ── Contact phase: apply on-hit effects, then fire any combo procs they triggered ──
  const contactApplied = depth === 0
    ? applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'contact' })
    : applyEffects({ gameId, action, members, effectTrackers, times: applyTimes, trigger: 'contact' });
  processComboProcs(contactApplied, action, ctx, depth, onFootprint);

  // ── Contact interval procs: fire interval effects applied on contact, using remaining window ──
  if (depth === 0) {
    const { duration, offset } = action;
    processContactIntervalProcs(contactApplied, ctx, duration - offset, depth, onFootprint);
  }

  // ── FollowUp procs: fire any action-triggered followUp procs from active effects ──
  // Cooldown is set before recursing inside processFollowUpProcs, so re-entrant
  // calls naturally skip already-fired effects without needing a depth guard.
  processFollowUpProcs(action, ctx, depth, onFootprint);

  // ── Decay/cooldowns (top-level actions only) ──
  if (depth === 0) {
    decayProcCounts(members, effectTrackers, action);
    tickProcCooldowns(procCooldownMap, action.duration);
    tickProcCooldowns(applyCooldownMap, action.duration);
  }
}

export const compileRotation = (gameId, rawTeam, characterId) => {
  const team = rawTeam.filter(m => m.memberId);

  const members = {};
  const allEffectDefinitions = {};

  for (const [index, member] of team.entries()) {
    const { memberId, rank, build = {} } = member;

    if (!actionsCache.get(memberId)) {
      actionsCache.set(memberId, normalizeActions(gameId, memberId, rank));
    }

    let normalizedEffects = normalizeEffectsCache.get(memberId);
    if (!normalizedEffects) {
      normalizedEffects = normalizeEffects(gameId, member);
      normalizeEffectsCache.set(memberId, normalizedEffects);
    }

    let statMap = compileStatMapCache.get(build);
    if (!statMap) {
      statMap = compileStatMap(gameId, memberId, build);
      compileStatMapCache.set(build, statMap);
    }

    const { castEffectsByAction, contactEffectsByAction, effectDefinitions } = normalizedEffects;
    Object.assign(allEffectDefinitions, effectDefinitions);
    members[memberId] = { index, statMap, castEffectsByAction, contactEffectsByAction, effectDefinitions };
  }

  const effectTrackers = {
    byMember: Object.fromEntries(team.map(m => [m.memberId, {}])),
    team: {},
    active: {},
    inactive: {},
    enemy: {},
    enemyStatuses: {},
  };
  const applyCooldownMap = {};
  const procCooldownMap = {};

  // Shared context object threaded through all processAction calls. activeId is
  // mutated per rotation action to track which member is the current rotation actor.
  const ctx = { gameId, members, effectTrackers, applyCooldownMap, procCooldownMap, allEffectDefinitions, characterId, activeId: null };

  // ── Priming pass ──────────────────────────────────────────────────────────
  // Replay the full rotation without recording footprints to warm up the effect
  // trackers into a steady-state snapshot (effects that will actually be active).
  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      ctx.activeId = memberId;
      processAction(actionsCache.get(memberId)[actionKey], ctx, 0, null);
    }
  }

  // ── Damage pass: record footprints ────────────────────────────────────────
  // Replay the rotation a second time, this time capturing a footprint at each
  // damage evaluation point. The footprints are later re-evaluated cheaply by
  // evaluateRotationSummary with different character builds.
  const footprints = [];

  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      ctx.activeId = memberId;
      processAction(actionsCache.get(memberId)[actionKey], ctx, 0, fp => footprints.push(fp));
    }
  }

  return { gameId, characterId, footprints };
};

export const evaluateRotation = (compiledRotation, newCharCompiledStatMap) => {
  const { gameId, characterId, footprints } = compiledRotation;
  const actionMap = {};

  for (const footprint of footprints) {
    const {
      actionKey,
      owner,
      type,
      element,
      attr,
      sumMvTimes,
      sumTimes,
      sumFlat,
      times,
      considered,
      hasMultipliers,
      repeatCount,
      fixedDamage,
      fixedHealing,
      constantEffectContribs,
      fixedVariableContribs,
      charVariableEffectSpecs,
      charConstantEffectContribsForSource,
      enemyStatMap,
    } = footprint;

    if (!actionMap[actionKey]) {
      actionMap[actionKey] = { owner, considered, damage: 0, healing: 0 };
    }

    if (type === 'shield' || type === 'buff' || !hasMultipliers) continue;

    // Pre-computed fixed result for non-character actions with no char variable effects
    if (fixedDamage !== null) {
      actionMap[actionKey].damage += fixedDamage;
      continue;
    }
    if (fixedHealing !== null) {
      actionMap[actionKey].healing += fixedHealing;
      continue;
    }

    // ── Determine the stat map to use as base for this action ────────────────
    // For character actions: newCharCompiledStatMap
    // For teammate actions affected by charVariableEffectSpecs: use teammate's
    // pre-compiled statMap (stored in constantEffectContribs already accounts
    // for the teammate's own base — we just need the owner's base to merge with).
    // NOTE: fixedDamage === null only when owner === characterId OR when
    // charVariableEffectSpecs is non-empty. In the latter case owner may differ.
    const isCharAction = owner === characterId;
    // For teammate actions with charVariableEffectSpecs, ownerBaseStatMap was
    // stored in the footprint during compileRotation.
    const ownerBaseStatMap = isCharAction ? newCharCompiledStatMap : footprint.ownerBaseStatMap ?? {};

    // ── Two-pass variable resolution (mirrors getCurrentStatMap logic) ────────

    // Pass 1: resolve charVariableEffectSpecs using (newCharCompiledStatMap + charConstant)
    // to get the character's "live" stat map at this moment.
    let charCurrentStatMap = newCharCompiledStatMap;
    if (charVariableEffectSpecs.length > 0) {
      const baseForSource = mergeStatMaps(newCharCompiledStatMap, charConstantEffectContribsForSource);
      const resolvedPass1 = {};
      for (const { variableStatMap, stacks, chance } of charVariableEffectSpecs) {
        const r = resolveVariableStatMap(variableStatMap, baseForSource);
        for (const [statId, val] of Object.entries(r)) {
          resolvedPass1[statId] = (resolvedPass1[statId] ?? 0) + val * stacks * chance;
        }
      }
      charCurrentStatMap = mergeStatMaps(newCharCompiledStatMap, charConstantEffectContribsForSource, resolvedPass1);
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

    const effectStatMap = mergeStatMaps(constantEffectContribs, fixedVariableContribs, charVariableResolved);
    const statMapWithEffects = mergeStatMaps(ownerBaseStatMap, effectStatMap);

    const baseValue = computeBase(statMapWithEffects, attr, sumMvTimes, sumTimes, sumFlat);

    if (type === 'heal') {
      const healingBonus = computeTotalStat('HB', statMapWithEffects);
      actionMap[actionKey].healing += baseValue * (1 + healingBonus) * times * repeatCount;
    } else {
      const bonuses = computeBonuses(statMapWithEffects, considered, enemyStatMap);
      const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
      actionMap[actionKey].damage += baseValue * bonuses * reductions * times * repeatCount;
    }
  }

  return actionMap;
};
