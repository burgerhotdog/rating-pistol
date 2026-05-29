import { CHARACTERS, WEAPONS, SETS, MISC, MVS } from '@/data';
import { compileStatMap, mergeStatMaps, computeTotalStat, toArray } from '@/utils';

const actionsCache = new Map();
const normalizeEffectsCache = new Map();
const compileStatMapCache = new WeakMap();

const resolveRankedValue = (value, rank) => {
  if (!Array.isArray(value)) return value;
  const [r1, r5] = value;
  return r1 + (r5 - r1) / 4 * (Math.min(rank, 5) - 1);
};

const mergeVariableStatMaps = (...maps) => {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, details] of Object.entries(map)) {
      (acc[statId] ??= []).push(details);
    }
    return acc;
  }, {});
};

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

const normalizeProc = (memberId, effectKey, proc, procIndex, rank = Infinity) => ({
  useIfConsidered: proc.useIfConsidered && toArray(proc.useIfConsidered),
  useIfCast: proc.useIfCast && toArray(proc.useIfCast),
  useIfAction: proc.useIfAction && toArray(proc.useIfAction).map(sk => `${memberId}-${sk}`),
  action: toArray(proc.action),
  inlineAction: normalizeInlineProcAction(memberId, effectKey, proc, procIndex, rank),
  times: proc.times ?? 1,
});

const getSetCounts = (member) => {
  if (member.setCounts) return member.setCounts;
  if (member.build?.setCounts) return member.build.setCounts;
  return (member.build?.equipList ?? []).reduce((acc, equip) => {
    const setId = equip?.setId;
    if (!setId) return acc;
    acc[setId] = (acc[setId] ?? 0) + 1;
    return acc;
  }, {});
};

const getActiveSetBonuses = (gameId, member) => {
  const setCounts = getSetCounts(member);
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

const normalizeActions = (gameId, memberId, memberRank) => {
  const resolved = {};

  // Resolve Skill Level
  const maxLevel = gameId === 'zenless-zone-zero' ? 12 : 10;
  const addBySkillId = {};

  const { skillLevelMods = [] } = CHARACTERS[gameId][memberId];
  for (const { rank, skillId, add } of skillLevelMods) {
    if (rank > memberRank) continue;
    addBySkillId[skillId] = add;
  }

  // Main loop
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

const normalizeEffects = (gameId, member) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const castEffectsByAction = {};
  const contactEffectsByAction = {};
  const effectDefinitions = {};

  function applyRankModifier(resolved, modifier = {}) {
    const { duration, maxUses, statMap, variableStatMap, followUpAction } = modifier;
    if (duration) resolved.duration += duration;
    if (maxUses) resolved.maxUses += maxUses;
    if (statMap) resolved.statMap = mergeStatMaps(resolved.statMap, statMap);
    if (variableStatMap) {
      resolved.variableStatMap = mergeVariableStatMaps(resolved.variableStatMap, variableStatMap);
    }
    if (followUpAction) {
      resolved.followUpAction.push(
        ...toArray(followUpAction).map((proc, procIndex) => normalizeProc(memberId, resolved.effectKey, proc, procIndex, rank))
      );
    }
  }

  let effectIndex = 0;
  function registerEffects(rawEffects, rank = Infinity) {
    const unlockedEffects = toArray(rawEffects).filter(e => (e.rank ?? 0) <= rank);
    for (const effect of unlockedEffects) {
      const effectKey = `${memberId}-${effectIndex}`;
      const resolved = {
        effectKey,
        chance: effect.chance ?? 1,
        applyCooldown: effect.applyCooldown ?? 0,
        removeOnCast: effect.removeOnCast && toArray(effect.removeOnCast),
        applyTo: effect.applyTo ?? 'self',
        maxStacks: effect.maxStacks ?? 1,
        duration: effect.duration ?? Infinity,
        maxUses: effect.maxUses ?? Infinity,
        followUpActionCooldown: effect.followUpActionCooldown ?? 0,
        useIfAction: effect.useIfAction && toArray(effect.useIfAction).map(shortKey => `${memberId}-${shortKey}`),
        useIfConsidered: effect.useIfConsidered && toArray(effect.useIfConsidered),
        useIfType: effect.useIfType && toArray(effect.useIfType),
        statMap: Object.fromEntries(
          Object.entries(effect.statMap ?? {}).map(([k, v]) => [k, resolveRankedValue(v, rank)])
        ),
        statusMap: effect.statusMap ?? {},
        applyIfEnemyStatus: effect.applyIfEnemyStatus ?? null,
        applyIfInflict: effect.applyIfInflict ?? null,
        variableStatMap: mergeVariableStatMaps(effect.variableStatMap),
        followUpAction: toArray(effect.followUpAction).map((proc, procIndex) => normalizeProc(memberId, effectKey, proc, procIndex, rank)),
        followUpActionInterval: effect.followUpActionInterval,
      };

      if (effect.rankModifiers) {
        for (const [rankReq, modifier] of Object.entries(effect.rankModifiers)) {
          if (Number(rankReq) <= rank) applyRankModifier(resolved, modifier);
        }
      }

      const applyWhen = effect.applyWhen;
      const applyOnAction = toArray(effect.applyOnAction).map(key => {
        const segments = key.split('-');
        if (segments.length === 3) return key;
        return `${memberId}-${key}`;
      });
      const applyOnType = toArray(effect.applyOnType);
      const applyOnCast = toArray(effect.applyOnCast);
      const applyOnConsidered = toArray(effect.applyOnConsidered);

      if (!applyWhen) {
        resolved.isPassive = true;
      } else {
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
  }

  registerEffects(CHARACTERS[gameId][memberId].effects, rank);
  registerEffects(WEAPONS[gameId][weaponId].effects, weaponRank);
  const setBonuses = getActiveSetBonuses(gameId, member);
  for (const setBonusEffects of setBonuses) registerEffects(setBonusEffects, Infinity);

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
  const constantEffectContribs = {};
  const fixedVariableContribs = {};
  const charVariableEffectSpecs = [];

  // Passive effects owned by the action owner
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

const computeBase = (statMap, attr, sumMvTimes, sumTimes, sumFlat) => {
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  const attrValue = computeTotalStat(attr, statMap);
  return sumFlat + attrValue * (sumMvTimes + flatMv * sumTimes) * (1 + percentMv);
};

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

function hasEnemyStatus(statusName, effectTrackers) {
  return effectTrackers.enemyStatuses[statusName]?.stacks ?? 0;
}

function hasAnyNegativeStatus(gameId, effectTrackers) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  return Object.keys(statuses).some(name => hasEnemyStatus(name, effectTrackers) > 0);
}

function applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap = {}, times = 1, trigger = 'cast' }) {
  const { owner: actionOwner, key: actionKey, input } = action;
  const member = members[actionOwner];
  if (!member) return;

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
  if (triggeredEffects.size === 0) return;

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

  function applyEffect(tracker, effect) {
    const { effectKey, maxStacks, duration, maxUses, followUpActionInterval } = effectDefinitions[effect];
    const currentStacks = tracker[effectKey]?.stacks ?? 0;
    tracker[effectKey] = {
      stacks: Math.min(currentStacks + times, maxStacks),
      timeRemaining: duration,
      followUpActionRemaining: maxUses,
      ...(followUpActionInterval ? { procTimer: tracker[effectKey]?.procTimer ?? followUpActionInterval } : {}),
    };
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
}

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

function tickProcCooldowns(procCooldownMap, delta) {
  for (const [cooldownKey, cooldownRemaining] of Object.entries(procCooldownMap)) {
    const nextValue = cooldownRemaining - delta;
    if (nextValue <= 0) delete procCooldownMap[cooldownKey];
    else procCooldownMap[cooldownKey] = nextValue;
  }
}

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

function decayProcCounts(members, effectTrackers, action) {
  const { team, active, inactive, enemy, byMember } = effectTrackers;
  const { key: actionKey } = action;

  function decayMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (effectTracker.followUpActionRemaining === Infinity) continue;
      const effectOwner = effectKey.split('-')[0];
      const { useIfAction, followUpAction } = members[effectOwner].effectDefinitions[effectKey];
      if (useIfAction && !useIfAction.includes(actionKey)) continue;
      if (!followUpAction) effectTracker.followUpActionRemaining -= 1;
      if (effectTracker.followUpActionRemaining <= 0) delete trackerMap[effectKey];
    }
  }

  decayMap(team);
  decayMap(active);
  decayMap(inactive);
  decayMap(enemy);
  for (const map of Object.values(byMember)) decayMap(map);
}

// ─── Footprint-recording variants of processProcEffects / tickIntervalProcs ──

function recordProcEffectFootprints({
  gameId,
  members,
  action,
  effectTrackers,
  procCooldownMap,
  footprints,
  characterId,
  allEffectDefinitions,
}) {
  const { key: actionKey, owner: actionOwner, considered, cast, type } = action;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (procCooldownMap[effectKey]) continue;
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;
      if (effectDef.useIfType && !effectDef.useIfType.includes(type)) continue;

      const { followUpAction, followUpActionCooldown, followUpActionInterval } = effectDef;
      if (!followUpAction) continue;
      if (followUpActionInterval) continue;

      let procFired = false;
      for (const { useIfConsidered, useIfCast, useIfAction, action: procActionIds, inlineAction, times } of followUpAction) {
        if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;
        if (useIfCast && !(cast ?? []).some(c => useIfCast.includes(c))) continue;
        if (useIfAction && !useIfAction.includes(actionKey)) continue;

        const procActions = [];
        for (const procActionId of procActionIds) {
          const procActionKey = effectOwner + '-' + procActionId;
          const procAction = actionsCache.get(effectOwner)?.[procActionKey];
          if (!procAction) continue;
          procActions.push(procAction);
        }
        if (inlineAction) procActions.push(inlineAction);

        for (const procAction of procActions) {
          applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'cast' });

          footprints.push(buildFootprint({
            gameId,
            action: procAction,
            effectTrackers,
            activeId: actionOwner,
            members,
            allEffectDefinitions,
            characterId,
            repeatCount: effectTracker.stacks * times,
          }));

          applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'contact' });
        }

        if (followUpActionCooldown > 0) procCooldownMap[effectKey] = followUpActionCooldown;
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

function recordIntervalProcFootprints({
  gameId,
  members,
  effectTrackers,
  activeId,
  elapsed,
  procCooldownMap,
  footprints,
  characterId,
  allEffectDefinitions,
}) {
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;

      const { followUpAction, followUpActionCooldown, followUpActionInterval } = effectDef;
      if (!followUpAction?.length || !followUpActionInterval) continue;
      if (procCooldownMap[effectKey]) continue;

      effectTracker.procTimer -= elapsed;

      while (effectTracker.procTimer <= 0) {
        for (const { action: procActionIds, inlineAction, times } of followUpAction) {
          const procActions = [];
          for (const procActionId of procActionIds) {
            const procActionKey = effectOwner + '-' + procActionId;
            const procAction = actionsCache.get(effectOwner)?.[procActionKey];
            if (!procAction) continue;
            procActions.push(procAction);
          }
          if (inlineAction) procActions.push(inlineAction);

          for (const procAction of procActions) {
            applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'cast' });

            footprints.push(buildFootprint({
              gameId,
              action: procAction,
              effectTrackers,
              activeId,
              members,
              allEffectDefinitions,
              characterId,
              repeatCount: effectTracker.stacks * times,
            }));

            applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'contact' });
          }
        }

        effectTracker.procTimer += followUpActionInterval;
        if (followUpActionCooldown > 0) {
          procCooldownMap[effectKey] = followUpActionCooldown;
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

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run the rotation once and record the full effect state at every damage
 * evaluation point. The returned summary can be passed to
 * `evaluateRotationSummary` many times with different character builds
 * without re-running the effect simulation.
 *
 * @param {string} gameId
 * @param {Array}  rawTeam   - same format as simulateRotation's team param
 * @param {string} characterId - the character whose build will vary
 * @returns {{ footprints: Array }}
 */
export const summarizeRotation = (gameId, rawTeam, characterId) => {
  const team = rawTeam.filter(m => m.memberId);

  const members = {};
  const allEffectDefinitions = {};

  for (const [index, member] of team.entries()) {
    const { memberId, rank, build = {} } = member;

    if (!actionsCache.get(memberId)) {
      actionsCache.set(memberId, normalizeActions(gameId, memberId, rank));
    }

    const setCounts = getSetCounts(member);
    const setCacheKey = Object.keys(setCounts).sort().map(k => `${k}:${setCounts[k]}`).join(',');
    const effectsCacheKey = `${gameId}-${memberId}-${rank}-${member.weaponId}-${member.weaponRank}-${setCacheKey}`;
    let normalizedEffects = normalizeEffectsCache.get(effectsCacheKey);
    if (!normalizedEffects) {
      normalizedEffects = normalizeEffects(gameId, member);
      normalizeEffectsCache.set(effectsCacheKey, normalizedEffects);
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

  // ── Priming pass (identical to simulateRotation) ──────────────────────────
  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      const action = actionsCache.get(memberId)[actionKey];
      const { duration, offset } = action;

      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'cast' });
      advanceEffects(effectTrackers, offset, duration);
      tickEnemyStatuses(gameId, effectTrackers, duration);
      tickProcCooldowns(procCooldownMap, offset);
      tickProcCooldowns(applyCooldownMap, offset);
      // Interval procs in priming pass — just advance timers, no footprint needed
      _tickIntervalProcsNoRecord({ gameId, members, effectTrackers, activeId: memberId, elapsed: duration, procCooldownMap });
      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'contact' });
      _processProcEffectsNoRecord({ gameId, members, action, effectTrackers, procCooldownMap });
      decayProcCounts(members, effectTrackers, action);
      tickProcCooldowns(procCooldownMap, duration);
      tickProcCooldowns(applyCooldownMap, duration);
    }
  }

  // ── Damage pass: record footprints ────────────────────────────────────────
  const footprints = [];

  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      const action = actionsCache.get(memberId)[actionKey];
      const { owner: activeId, duration, offset } = action;

      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'cast' });
      advanceEffects(effectTrackers, offset, duration);
      tickEnemyStatuses(gameId, effectTrackers, duration);

      recordIntervalProcFootprints({
        gameId, members, effectTrackers, activeId, elapsed: duration,
        procCooldownMap, footprints, characterId, allEffectDefinitions,
      });

      tickProcCooldowns(procCooldownMap, offset);
      tickProcCooldowns(applyCooldownMap, offset);

      // Main action footprint
      footprints.push(buildFootprint({
        gameId, action, effectTrackers, activeId, members, allEffectDefinitions,
        characterId, repeatCount: 1,
      }));

      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'contact' });

      recordProcEffectFootprints({
        gameId, members, action, effectTrackers, procCooldownMap,
        footprints, characterId, allEffectDefinitions,
      });

      decayProcCounts(members, effectTrackers, action);
      tickProcCooldowns(procCooldownMap, duration);
      tickProcCooldowns(applyCooldownMap, duration);
    }
  }

  return { gameId, footprints };
};

// Priming-pass versions that advance state without recording footprints
function _processProcEffectsNoRecord({ gameId, members, action, effectTrackers, procCooldownMap }) {
  const { key: actionKey, owner: actionOwner, considered, cast, type } = action;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (procCooldownMap[effectKey]) continue;
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;
      if (effectDef.useIfType && !effectDef.useIfType.includes(type)) continue;

      const { followUpAction, followUpActionCooldown, followUpActionInterval } = effectDef;
      if (!followUpAction) continue;
      if (followUpActionInterval) continue;

      let procFired = false;
      for (const { useIfConsidered, useIfCast, useIfAction, action: procActionIds, inlineAction, times } of followUpAction) {
        if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;
        if (useIfCast && !(cast ?? []).some(c => useIfCast.includes(c))) continue;
        if (useIfAction && !useIfAction.includes(actionKey)) continue;

        const procActions = [];
        for (const procActionId of procActionIds) {
          const procActionKey = effectOwner + '-' + procActionId;
          const procAction = actionsCache.get(effectOwner)?.[procActionKey];
          if (!procAction) continue;
          procActions.push(procAction);
        }
        if (inlineAction) procActions.push(inlineAction);

        for (const procAction of procActions) {
          applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'cast' });
          applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'contact' });
        }

        if (followUpActionCooldown > 0) procCooldownMap[effectKey] = followUpActionCooldown;
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

function _tickIntervalProcsNoRecord({ gameId, members, effectTrackers, _activeId, elapsed, procCooldownMap }) {
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;

      const { followUpAction, followUpActionCooldown, followUpActionInterval } = effectDef;
      if (!followUpAction?.length || !followUpActionInterval) continue;
      if (procCooldownMap[effectKey]) continue;

      effectTracker.procTimer -= elapsed;

      while (effectTracker.procTimer <= 0) {
        for (const { action: procActionIds, inlineAction, times } of followUpAction) {
          const procActions = [];
          for (const procActionId of procActionIds) {
            const procActionKey = effectOwner + '-' + procActionId;
            const procAction = actionsCache.get(effectOwner)?.[procActionKey];
            if (!procAction) continue;
            procActions.push(procAction);
          }
          if (inlineAction) procActions.push(inlineAction);

          for (const procAction of procActions) {
            applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'cast' });
            applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'contact' });
          }
        }

        effectTracker.procTimer += followUpActionInterval;
        if (followUpActionCooldown > 0) {
          procCooldownMap[effectKey] = followUpActionCooldown;
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

// ─── evaluateRotationSummary ──────────────────────────────────────────────────

/**
 * Re-evaluate a previously recorded summary with a new character stat map.
 * Much cheaper than a full simulateRotation call.
 *
 * @param {{ footprints: Array }} summary
 * @param {string} characterId
 * @param {Object} newCharCompiledStatMap  - output of compileStatMap for the new build
 * @returns {Object} actionMap  - same shape as simulateRotation's return value
 */
export const evaluateRotationSummary = (summary, characterId, newCharCompiledStatMap) => {
  const { gameId, footprints } = summary;
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
    // stored in the footprint during summarizeRotation.
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
