import { CHARACTERS, WEAPONS, SETS, MISC, MVS } from '@/data';
import { compileStatMap, mergeStatMaps, computeTotalStat, toArray, normalizeAction } from '@/utils';

const actionsCache = new Map();
const normalizeEffectsCache = new Map();
const compileStatMapCache = new WeakMap();

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

  // Enemy resistance multiplier
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

  // Enemy defense multiplier
  const enemyDef = 8 * (MAX_LEVEL + 10) + 792;
  const defIgnore = (statMap['IGNORE_DEF'] ?? 0) + (enemyStatMap['SHRED_DEF'] ?? 0);
  const defMult = (800 + 8 * MAX_LEVEL) / (800 + 8 * MAX_LEVEL + enemyDef * (1 - defIgnore))

  return resMult * defMult;
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

  // First, add all constant effects
  addConstantEffectStats(effectTrackers.byMember[memberId] ?? {});
  addConstantEffectStats(effectTrackers.team ?? {});
  addConstantEffectStats(effectTrackers.active ?? {});

  // Then, resolve and add variable effects using base+constant stats
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

const simulateAction = ({ gameId, action, effectTrackers, activeId, members, allEffectDefinitions }) => {
  const { owner: actionOwner, actionKey, element, type, considered, attr, hasMultipliers, sumMvTimes, sumTimes, sumFlat, times } = action;

  if (type === 'shield') return {};
  if (type === 'buff') return {};
  if (!hasMultipliers) return {};

  // Cache for stat maps to avoid recomputing for the same member
  const statMapCache = {};
  const getOrComputeStatMap = (memberId) => {
    if (!statMapCache[memberId]) {
      statMapCache[memberId] = getCurrentStatMap(memberId, effectTrackers, members);
    }
    return statMapCache[memberId];
  };

  // Build stat map from effects
  const effectStatMap = {};
  // Tracked effects
  const trackersToEval = [
    ...Object.entries(members[actionOwner].effectDefinitions).filter(([, { isPassive }]) => isPassive),
    ...Object.entries(effectTrackers.team),
    ...Object.entries(activeId === actionOwner ? effectTrackers.active : effectTrackers.inactive),
    ...Object.entries(effectTrackers.byMember[actionOwner]),
  ];
  for (const [effectKey, { stacks = 1 }] of trackersToEval) {
    const {
      useIfAction,
      useIfConsidered,
      statMap,
      variableStatMap,
      chance = 1,
    } = allEffectDefinitions[effectKey];

    if (useIfAction && !useIfAction.includes(actionKey)) continue;
    if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;

    if (statMap) {
      for (const [statId, value] of Object.entries(statMap)) {
        effectStatMap[statId] ??= 0
        effectStatMap[statId] += value * chance * stacks;
      }
    }

    if (variableStatMap) {
      const effectOwnerCurrentStats = getOrComputeStatMap(effectKey.split('-')[0]);
      const resolvedVariableStatMap = resolveVariableStatMap(variableStatMap, effectOwnerCurrentStats);
      for (const [statId, value] of Object.entries(resolvedVariableStatMap)) {
        effectStatMap[statId] ??= 0
        effectStatMap[statId] += value * chance * stacks;
      }
    }
  }

  const statMapWithEffects = mergeStatMaps(members[actionOwner].statMap, effectStatMap);

  const baseValue = computeBase(statMapWithEffects, attr, sumMvTimes, sumTimes, sumFlat);

  if (type === 'heal') {
    const healingBonus = computeTotalStat('HB', statMapWithEffects);
    return { healing: baseValue * (1 + healingBonus) * times };
  }

  const enemyStatMap = {};
  for (const [effectKey, { stacks }] of Object.entries(effectTrackers.enemy)) {
    const [effectOwner] = effectKey.split('-');
    const { statMap } = members[effectOwner].effectDefinitions[effectKey];
    for (const stat in statMap) {
      enemyStatMap[stat] ??= 0;
      enemyStatMap[stat] += statMap[stat] * stacks;
    }
  }

  const bonuses = computeBonuses(statMapWithEffects, considered, enemyStatMap);
  const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);

  return { damage: baseValue * bonuses * reductions * times };
};

const resolveRankedValue = (value, rank) => {
  if (!Array.isArray(value)) return value;
  const [r1, r5] = value;
  return r1 + (r5 - r1) / 4 * (Math.min(rank, 5) - 1);
};

const resolveMultiplierValue = (value) => {
  if (value == null) return 0;
  return Array.isArray(value) ? value[9] : value;
};

const normalizeInlineProcAction = (memberId, effectKey, proc, procIndex, rank = Infinity) => {
  const inline = proc.action ?? proc.inlineAction
    ?? (proc.multipliers || proc.mv != null || proc.flat != null ? proc : null);
  if (!inline) return null;

  const cast = toArray(inline.cast ?? []);
  const considered = toArray(inline.considered ?? cast);

  let sumMvTimes = 0;
  let sumTimes = 0;
  let sumFlat = 0;
  const multipliers = inline.multipliers
    ? toArray(inline.multipliers)
    : [{ mv: inline.mv, flat: inline.flat, times: 1 }];

  for (const { mv: rawMv, flat: rawFlat, times = 1 } of multipliers) {
    if (rawMv != null) {
      const mv = Array.isArray(rawMv) && rawMv.length === 2
        ? resolveRankedValue(rawMv, rank)
        : resolveMultiplierValue(rawMv);
      sumMvTimes += mv * times;
      sumTimes += times;
    }
    if (rawFlat != null) {
      const flat = Array.isArray(rawFlat) && rawFlat.length === 2
        ? resolveRankedValue(rawFlat, rank)
        : resolveMultiplierValue(rawFlat);
      sumFlat += flat;
    }
  }

  return {
    actionKey: `${effectKey}-proc-${procIndex}`,
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

const normalizeActions = (gameId, memberId) => {
  const rawSkillTree = MVS[gameId][memberId];
  const resolved = {};

  for (const nodeRef in rawSkillTree) {
    const { skills } = rawSkillTree[nodeRef];

    for (const actionRef in skills) {
      const actionKey = `${memberId}-${nodeRef}-${actionRef}`;
      const normalized = normalizeAction(gameId, memberId, nodeRef, actionRef);

      resolved[actionKey] = { actionKey, ...normalized };
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
          if (Number(rankReq) <= rank) {
            applyRankModifier(resolved, modifier);
          }
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
            if (applyWhen === 'cast') {
              (castEffectsByAction[actionKey] ??= []).push(effectKey);
            }

            if (applyWhen === 'contact') {
              (contactEffectsByAction[actionKey] ??= []).push(effectKey);
            }
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
  for (const setBonusEffects of setBonuses) {
    registerEffects(setBonusEffects, Infinity);
  }

  return { castEffectsByAction, contactEffectsByAction, effectDefinitions };
};

export const simulateRotation = (gameId, rawTeam) => {
  // remove null members
  const team = rawTeam.filter(m => m.memberId);

  // normalize actions and effects
  const members = {};
  const allEffectDefinitions = {};
  for (const [index, member] of team.entries()) {
    const { memberId, build = {} } = member;

    if (!actionsCache.get(memberId)) {
      actionsCache.set(memberId, normalizeActions(gameId, memberId));
    }

    const setCounts = getSetCounts(member);
    const setCacheKey = Object.keys(setCounts).sort().map(k => `${k}:${setCounts[k]}`).join(',');
    const effectsCacheKey = `${gameId}-${memberId}-${member.rank}-${member.weaponId}-${member.weaponRank}-${setCacheKey}`;
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
    members[memberId] = {
      index,
      statMap,
      castEffectsByAction,
      contactEffectsByAction,
      effectDefinitions,
    };
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

  // Priming pass: one full cycle to establish steady-state effect conditions
  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      const action = actionsCache.get(memberId)[actionKey];
      const { duration, offset } = action;

      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'cast' });
      advanceEffects(effectTrackers, offset, duration);
      tickEnemyStatuses(gameId, effectTrackers, duration);
      tickIntervalProcs({ gameId, members, effectTrackers, activeId: memberId, elapsed: duration, procCooldownMap });
      tickProcCooldowns(procCooldownMap, offset);
      tickProcCooldowns(applyCooldownMap, offset);
      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'contact' });
      processProcEffects({ gameId, members, action, effectTrackers, procCooldownMap });
      decayProcCounts(members, effectTrackers, action);
      tickProcCooldowns(procCooldownMap, duration);
      tickProcCooldowns(applyCooldownMap, duration);
    }
  }

  // Damage pass: one full cycle, tracking damage for every action
  const actionMap = {};
  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      const action = actionsCache.get(memberId)[actionKey];
      const { owner: activeId, duration, offset } = action;

      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'cast' });
      advanceEffects(effectTrackers, offset, duration);
      tickEnemyStatuses(gameId, effectTrackers, duration);
      tickIntervalProcs({ gameId, members, effectTrackers, activeId, elapsed: duration, procCooldownMap, actionMap, allEffectDefinitions });
      tickProcCooldowns(procCooldownMap, offset);
      tickProcCooldowns(applyCooldownMap, offset);

      const { damage = 0, healing = 0 } = simulateAction({ gameId, action, effectTrackers, activeId, members, allEffectDefinitions });
      actionMap[actionKey] = {
        owner: action.owner,
        considered: action.considered,
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap, trigger: 'contact' });
      processProcEffects({ gameId, members, action, effectTrackers, procCooldownMap, actionMap, allEffectDefinitions });
      decayProcCounts(members, effectTrackers, action);
      tickProcCooldowns(procCooldownMap, duration);
      tickProcCooldowns(applyCooldownMap, duration);
    }
  }

  return actionMap;
};

function applyEffects({ gameId, action, members, effectTrackers, applyCooldownMap = {}, times = 1, trigger = 'cast' }) {
  const { owner: actionOwner, actionKey, input } = action;

  const member = members[actionOwner];
  if (!member) return;

  // Abort effects owned by the action owner if the current input is in their removeOnCast.
  // Only runs during the cast phase to avoid double-removal.
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
    for (const memberMap of Object.values(effectTrackers.byMember)) {
      removeFromMap(memberMap);
    }
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

      if (Object.keys(effectStatMap).length > 0) {
        applyEffect(effectTrackers.enemy, effect);
      }

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
      if (validTargets.includes(applyTo)) {
        applyEffect(effectTrackers.byMember[id], effect);
      }
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
      if (validTargets.includes(applyTo)) {
        applyEffect(effectTrackers.byMember[id], effect);
      }
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
  for (const memberMap of Object.values(byMember)) {
    advanceMap(memberMap);
  }
}

function tickProcCooldowns(procCooldownMap, delta) {
  for (const [cooldownKey, cooldownRemaining] of Object.entries(procCooldownMap)) {
    const nextValue = cooldownRemaining - delta;
    if (nextValue <= 0) {
      delete procCooldownMap[cooldownKey];
    } else {
      procCooldownMap[cooldownKey] = nextValue;
    }
  }
}

function processProcEffects({
  gameId,
  members,
  action,
  effectTrackers,
  procCooldownMap,
  actionMap = null,
  allEffectDefinitions,
}) {
  const { actionKey, owner: actionOwner, considered } = action;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (procCooldownMap[effectKey]) continue;

      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;

      const { followUpAction, followUpActionCooldown, followUpActionInterval } = effectDef;
      if (!followUpAction) continue;
      if (followUpActionInterval) continue;

      let procFired = false;
      for (const { useIfConsidered, useIfAction, action, inlineAction, times } of followUpAction) {
        if (useIfConsidered && !considered.some(c => useIfConsidered.includes(c))) continue;
        if (useIfAction && !useIfAction.includes(actionKey)) continue;

        const procActions = [];
        for (const procActionId of action) {
          const procActionKey = effectOwner + '-' + procActionId;
          const procAction = actionsCache.get(effectOwner)[procActionKey];
          if (!procAction) continue;
          procActions.push(procAction);
        }
        if (inlineAction) {
          procActions.push(inlineAction);
        }

        for (const procAction of procActions) {
          const { actionKey: procActionKey } = procAction;

          applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'cast' });

          if (actionMap) {
            const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction({
              gameId,
              action: procAction,
              effectTrackers,
              activeId: actionOwner,
              members,
              allEffectDefinitions,
            });

            actionMap[procActionKey] = {
              owner: procAction.owner,
              considered: procAction.considered,
              damage: (actionMap[procActionKey]?.damage ?? 0) + procDamage * effectTracker.stacks * times,
              healing: (actionMap[procActionKey]?.healing ?? 0) + procHealing * effectTracker.stacks * times,
            };
          }

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

function decayProcCounts(members, effectTrackers, action) {
  const { team, active, inactive, enemy, byMember } = effectTrackers;
  const { actionKey } = action;

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

function hasEnemyStatus(statusName, effectTrackers) {
  return effectTrackers.enemyStatuses[statusName]?.stacks ?? 0;
}

function hasAnyNegativeStatus(gameId, effectTrackers) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  return Object.keys(statuses).some(name => hasEnemyStatus(name, effectTrackers) > 0);
}

function tickIntervalProcs({ gameId, members, effectTrackers, activeId, elapsed, procCooldownMap, actionMap = null, allEffectDefinitions }) {
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
            const { actionKey: procActionKey } = procAction;

            applyEffects({ gameId, action: procAction, members, effectTrackers, times, trigger: 'cast' });

            if (actionMap) {
              const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction({
                gameId,
                action: procAction,
                effectTrackers,
                activeId,
                members,
                allEffectDefinitions,
              });

              actionMap[procActionKey] = {
                owner: procAction.owner,
                considered: procAction.considered,
                damage: (actionMap[procActionKey]?.damage ?? 0) + procDamage * effectTracker.stacks * times,
                healing: (actionMap[procActionKey]?.healing ?? 0) + procHealing * effectTracker.stacks * times,
              };
            }

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

function tickEnemyStatuses(gameId, effectTrackers, elapsed) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  for (const [statusName, statusDef] of Object.entries(statuses)) {
    const state = effectTrackers.enemyStatuses[statusName];
    if (!state) continue;

    if (state.duration !== undefined) {
      state.duration -= elapsed;
      if (state.duration <= 0) {
        delete effectTrackers.enemyStatuses[statusName];
        continue;
      }
    }

    state.tickTimer -= elapsed;
    while (state.tickTimer <= 0 && state.stacks > 0) {
      if (statusDef.consumesOnTick) {
        state.stacks--;
        if (state.stacks === 0) {
          delete effectTrackers.enemyStatuses[statusName];
          break;
        }
      }
      state.tickTimer += statusDef.tickInterval;
    }
  }
}
