import { CHARACTERS, WEAPONS, SETS, MISC, MVS } from '@/data';
import { compileStatMap, mergeStatMaps, computeTotalStat, toArray } from '@/utils';

const DEFAULT_CAST = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "7": "AUTO",
  "8": "OS",
};
const SPECIAL_CASTS = new Set(["CA", "JA", "DA", "HK", "RK", "AUTO"]);

const actionsCache = new Map();
const normalizeEffectsCache = new WeakMap();
const compileStatMapCache = new WeakMap();

const computeBase = (statMap, attr, multipliers) => {
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  const attrValue = computeTotalStat(attr, statMap);

  let baseDamage = 0;
  for (const { mv: rawMv, times = 1 } of multipliers) {
    const mv = Array.isArray(rawMv) ? rawMv[9] : rawMv;
    const mvValue = (mv + flatMv) * (1 + percentMv);
    baseDamage += attrValue * mvValue * times;
  }

  return baseDamage;
};

const computeBonuses = (statMap, element, dmgTypes) => {
  const critRate = Math.max(Math.min(computeTotalStat('CR', statMap), 1), 0);
  const critDamage = computeTotalStat('CD', statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  let dmgBonusMult = 1 + computeTotalStat('ALL', statMap);
  let ampMult = 1 + (statMap['AMP_ALL'] ?? 0);

  for (const type of [element, ...dmgTypes]) {
    dmgBonusMult += computeTotalStat(type, statMap);
    ampMult += statMap[`AMP_${type}`] ?? 0;
  }

  return critMult * dmgBonusMult * ampMult;
};

const computeReductions = (gameId, statMap, element, dmgTypes) => {
  const { MAX_LEVEL, ENEMY_RES } = MISC[gameId];

  // Enemy resistance multiplier
  let resIgnore = statMap[`IGNORE_${element}`] ?? 0;
  for (const type of dmgTypes) resIgnore += statMap[`IGNORE_${element}_${type}`] ?? 0;
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
  let defIgnore = statMap['IGNORE_DEF'] ?? 0;
  for (const type of dmgTypes) defIgnore += statMap[`IGNORE_DEF_${type}`] ?? 0;
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
      const effectOwner = effectKey.slice(0, 4);
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
      const effectOwner = effectKey.slice(0, 4);
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

const simulateAction = ({ gameId, action, effectTrackers, activeId, members }) => {
  const { owner: actionOwner, actionKey, type, input, considered, special, attr, multipliers, times } = action;
  const { element } = CHARACTERS[gameId][actionOwner];

  if (type === 'SHIELD') return {};
  if (type === 'BUFF') return {};
  if (!multipliers) return {};

  const dmgTypes = [considered, special].filter(Boolean);
  if (input === 'CA') dmgTypes.push('CA');

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
  for (const [effectKey, { stacks }] of Object.entries(effectTrackers.team)) {
    const effectOwner = effectKey.slice(0, 4);
    const effectDefinition = members[effectOwner].effectDefinitions[effectKey];
    const { actionFilter } = effectDefinition;
    if (actionFilter && !actionFilter.includes(actionKey)) continue;
    const effectOwnerCurrentStats = getOrComputeStatMap(effectOwner);
    applyEffectStatMap(effectStatMap, effectDefinition, effectOwnerCurrentStats, stacks);
  }

  // Apply active-target effects only if the action owner matches the current actor
  if (activeId === actionOwner) {
    for (const [effectKey, { stacks }] of Object.entries(effectTrackers.active)) {
      const effectOwner = effectKey.slice(0, 4);
      const effectDefinition = members[effectOwner].effectDefinitions[effectKey];
      const { actionFilter } = effectDefinition;
      if (actionFilter && !actionFilter.includes(actionKey)) continue;
      const effectOwnerCurrentStats = getOrComputeStatMap(effectOwner);
      applyEffectStatMap(effectStatMap, effectDefinition, effectOwnerCurrentStats, stacks);
    }
  } else {
    for (const [effectKey, { stacks }] of Object.entries(effectTrackers.inactive)) {
      const effectOwner = effectKey.slice(0, 4);
      const effectDefinition = members[effectOwner].effectDefinitions[effectKey];
      const { actionFilter } = effectDefinition;
      if (actionFilter && !actionFilter.includes(actionKey)) continue;
      const effectOwnerCurrentStats = getOrComputeStatMap(effectOwner);
      applyEffectStatMap(effectStatMap, effectDefinition, effectOwnerCurrentStats, stacks);
    }
  }
  
  // Include character-specific effects
  for (const [effectKey, { stacks }] of Object.entries(effectTrackers.byMember[actionOwner])) {
    const effectOwner = effectKey.slice(0, 4);
    const effectDefinition = members[effectOwner].effectDefinitions[effectKey];
    const { actionFilter } = effectDefinition;
    if (actionFilter && !actionFilter.includes(actionKey)) continue;
    const effectOwnerCurrentStats = getOrComputeStatMap(effectOwner);
    applyEffectStatMap(effectStatMap, effectDefinition, effectOwnerCurrentStats, stacks);
  }

  for (const effectDefinition of Object.values(members[actionOwner].effectDefinitions)) {
    const { isPassive, chance, actionFilter } = effectDefinition;
    if (!isPassive) continue;
    if (actionFilter && !actionFilter.includes(actionKey)) continue;

    const passiveMemberCurrentStats = getOrComputeStatMap(actionOwner);
    applyEffectStatMap(effectStatMap, effectDefinition, passiveMemberCurrentStats, chance);
  }

  const statMapWithEffects = mergeStatMaps(members[actionOwner].statMap, effectStatMap);

  if (type === 'HEAL') {
    const baseHealing = multipliers.map(mult => {
      const { flat, mv } = mult;
      if (flat) return Array.isArray(flat) ? flat[9] : flat;
      if (mv) return Array.isArray(mv) ? (mv[9] * computeTotalStat(attr, statMapWithEffects)) : (mv * computeTotalStat(attr, statMapWithEffects));
    }).reduce((acc, val) => acc + val, 0);

    const healingBonus = computeTotalStat('HB', statMapWithEffects);
    return { healing: baseHealing * (1 + healingBonus) * times };
  };

  const baseDmg = computeBase(statMapWithEffects, attr, multipliers);
  const bonuses = computeBonuses(statMapWithEffects, element, dmgTypes);
  const reductions = computeReductions(gameId, statMapWithEffects, element, dmgTypes);

  return { damage: baseDmg * bonuses * reductions * times };
};

function applyEffectStatMap(baseStatMap, effectDefinition, sourceStatMap, multiplier = 1) {
  const { statMap = {}, variableStatMap = {} } = effectDefinition;

  for (const [statId, val] of Object.entries(statMap)) {
    baseStatMap[statId] = (baseStatMap[statId] ?? 0) + val * multiplier;
  }

  const resolvedVariableStatMap = resolveVariableStatMap(variableStatMap, sourceStatMap);
  for (const [statId, val] of Object.entries(resolvedVariableStatMap)) {
    baseStatMap[statId] = (baseStatMap[statId] ?? 0) + val * multiplier;
  }
}

const resolveRankedValue = (value, rank) => {
  if (!Array.isArray(value)) return value;
  const [r1, r5] = value;
  return r1 + (r5 - r1) / 4 * (Math.min(rank, 5) - 1);
};

const normalizeProc = (memberId, proc) => ({
  filter: proc.filter && toArray(proc.filter),
  actionKeyTrigger: proc.actionKeyTrigger && toArray(proc.actionKeyTrigger).map(sk => `${memberId}-${sk}`),
  actions: toArray(proc.actions),
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
      const meta = skills[actionRef];

      const actionKey = `${memberId}-${nodeRef}-${actionRef}`;
      const type = meta.type ?? 'DAMAGE';
      const cast = meta.cast ?? DEFAULT_CAST[nodeRef];
      const considered = meta.considered ?? (cast.endsWith("DC") ? "BA" : cast.startsWith("M") ? cast.slice(1) : SPECIAL_CASTS.has(cast) ? DEFAULT_CAST[nodeRef] : cast);

      resolved[actionKey] = {
        actionKey,
        owner: memberId,
        skill: nodeRef,
        type,
        cast,
        considered,
        special: meta.special,
        duration: meta.duration ?? 1000,
        offset: meta.offset ?? 500,
        attr: meta.attr ?? 'ATK',
        multipliers: meta.multipliers,
        times: meta.times ?? 1,
      };
    }
  }

  return resolved;
};

const normalizeEffects = (gameId, member) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const effectsByAction = {};
  const effectDefinitions = {};

  function applyRankModifier(resolved, modifier = {}) {
    const { duration, maxProcs, statMap, variableStatMap, procs } = modifier;

    if (duration) resolved.duration += duration;
    if (maxProcs) resolved.maxProcs += maxProcs;

    if (statMap) resolved.statMap = mergeStatMaps(resolved.statMap, statMap);

    if (variableStatMap) {
      resolved.variableStatMap = mergeVariableStatMaps(resolved.variableStatMap, variableStatMap);
    }

    if (procs) {
      resolved.procs.push(...toArray(procs).map(proc => normalizeProc(memberId, proc)));
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
        target: effect.target ?? 'self',
        maxStacks: effect.maxStacks ?? 1,
        duration: effect.duration ?? Infinity,
        maxProcs: effect.maxProcs ?? Infinity,
        procsCooldown: effect.procsCooldown ?? 0,
        actionFilter: effect.actionFilter && toArray(effect.actionFilter).map(shortKey => `${memberId}-${shortKey}`),
        statMap: Object.fromEntries(
          Object.entries(effect.statMap ?? {}).map(([k, v]) => [k, resolveRankedValue(v, rank)])
        ),
        variableStatMap: mergeVariableStatMaps(effect.variableStatMap),
        procs: toArray(effect.procs).map(proc => normalizeProc(memberId, proc)),
      };

      if (effect.rankModifiers) {
        for (const [rankReq, modifier] of Object.entries(effect.rankModifiers)) {
          if (Number(rankReq) <= rank) {
            applyRankModifier(resolved, modifier);
          }
        }
      }

      const applyOnAction = toArray(effect.applyOnAction).map(shortKey => `${memberId}-${shortKey}`);
      const applyOnType = toArray(effect.applyOnType);
      const applyOnCast = toArray(effect.applyOnCast);
      const applyOnConsidered = toArray(effect.applyOnConsidered);

      if (!applyOnAction.length && !applyOnCast.length && !applyOnConsidered.length) {
        resolved.isPassive = true;
      } else {
        const actions = actionsCache.get(memberId);
        for (const actionKey in actions) {
          const { type, cast, considered, special } = actions[actionKey];

          const actionMatch = applyOnAction.includes(actionKey);
          const typeMatch = applyOnType.includes(type);
          const castMatch = applyOnCast.includes(cast);
          const consideredMatch = applyOnConsidered.includes(considered) || applyOnConsidered.includes(special);

          if (actionMatch || typeMatch || castMatch || consideredMatch) {
            (effectsByAction[actionKey] ??= []).push(effectKey);
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

  return { effectsByAction, effectDefinitions };
};

export const simulateRotation = (gameId, rawTeam) => {
  // remove null members
  const team = rawTeam.filter(m => m.memberId);

  // normalize actions and effects
  const members = {};
  for (const [index, member] of team.entries()) {
    const { memberId, build = {} } = member;

    if (!actionsCache.get(memberId)) {
      actionsCache.set(memberId, normalizeActions(gameId, memberId));
    }

    let normalizedEffects = normalizeEffectsCache.get(build);
    if (!normalizedEffects) {
      normalizedEffects = normalizeEffects(gameId, member);
      normalizeEffectsCache.set(build, normalizedEffects);
    }

    let statMap = compileStatMapCache.get(build);
    if (!statMap) {
      statMap = compileStatMap(gameId, memberId, build);
      compileStatMapCache.set(build, statMap);
    }

    const { effectsByAction, effectDefinitions } = normalizedEffects;
    members[memberId] = {
      index,
      statMap,
      effectsByAction,
      effectDefinitions,
    };
  }

  const effectTrackers = {
    byMember: Object.fromEntries(team.map(m => [m.memberId, {}])),
    team: {},
    active: {},
    inactive: {},
  };
  const applyCooldownMap = {};
  const procCooldownMap = {};

  // Priming pass: one full cycle to establish steady-state effect conditions
  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      const action = actionsCache.get(memberId)[actionKey];
      const { duration, offset } = action;

      applyEffects({ action, members, effectTrackers, applyCooldownMap });
      advanceEffects(effectTrackers, offset, duration);
      tickProcCooldowns(procCooldownMap, offset);
      tickProcCooldowns(applyCooldownMap, offset);
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

      applyEffects({ action, members, effectTrackers, applyCooldownMap });
      advanceEffects(effectTrackers, offset, duration);
      tickProcCooldowns(procCooldownMap, offset);
      tickProcCooldowns(applyCooldownMap, offset);

      const { damage = 0, healing = 0 } = simulateAction({ gameId, action, effectTrackers, activeId, members });
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      processProcEffects({ gameId, members, action, effectTrackers, procCooldownMap, actionMap });
      decayProcCounts(members, effectTrackers, action);
      tickProcCooldowns(procCooldownMap, duration);
      tickProcCooldowns(applyCooldownMap, duration);
    }
  }

  return actionMap;
};

function applyEffects({ action, members, effectTrackers, applyCooldownMap = {}, times = 1 }) {
  const { owner: actionOwner, actionKey, input } = action;

  const member = members[actionOwner];
  if (!member) return;

  // Abort effects owned by the action owner if the current input is in their removeOnCast
  if (input) {
    const removeFromMap = (trackerMap) => {
      for (const effectKey of Object.keys(trackerMap)) {
        const effectOwner = effectKey.slice(0, 4);
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

  const { effectsByAction, effectDefinitions } = member;

  const triggeredEffects = new Set(effectsByAction[actionKey] ?? []);
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

  function applyEffect(tracker, effect) {
    const { effectKey, maxStacks, duration, maxProcs } = effectDefinitions[effect];
    const currentStacks = tracker[effectKey]?.stacks ?? 0;
    tracker[effectKey] = {
      stacks: Math.min(currentStacks + times, maxStacks),
      timeRemaining: duration,
      procsRemaining: maxProcs,
    };
  }

  for (const effect of triggeredEffects) {
    const { target, effectKey, applyCooldown } = effectDefinitions[effect];

    if (applyCooldownMap[effectKey]) continue;

    if (target === 'team' || target === 'active' || target === 'inactive') {
      applyEffect(effectTrackers[target], effect);
      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    for (const [id, validTargets] of Object.entries(validTargetsById)) {
      if (validTargets.includes(target)) {
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

  const { byMember, team, active, inactive } = effectTrackers;
  advanceMap(team);
  advanceMap(active);
  advanceMap(inactive);
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
}) {
  const { actionKey, owner: actionOwner, considered } = action;
  const { byMember, team, active, inactive } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (procCooldownMap[effectKey]) continue;

      const [effectOwner] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectKey];
      if (!effectDef) continue;

      const { procs, procsCooldown } = effectDef;
      if (!procs) continue;

      let procFired = false;
      for (const { filter, actionKeyTrigger, actions, times } of procs) {
        if (filter && !filter.includes(considered)) continue;
        if (actionKeyTrigger && !actionKeyTrigger.includes(actionKey)) continue;

        for (const procActionId of actions) {
          const procActionKey = effectOwner + '-' + procActionId;
          const procAction = actionsCache.get(effectOwner)[procActionKey];

          if (actionMap) {
            const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction({
              gameId,
              action: procAction,
              effectTrackers,
              activeId: actionOwner,
              members,
            });

            actionMap[procActionKey] = {
              damage: (actionMap[procActionKey]?.damage ?? 0) + procDamage * effectTracker.stacks * times,
              healing: (actionMap[procActionKey]?.healing ?? 0) + procHealing * effectTracker.stacks * times,
            };
          }

          applyEffects({ action: procAction, members, effectTrackers, times });
        }

        if (procsCooldown > 0) procCooldownMap[effectKey] = procsCooldown;
        procFired = true;
      }

      if (procFired) effectTracker.procsRemaining--;
    }
  }

  processTrackerMap(byMember[actionOwner] ?? {});
  processTrackerMap(team);
  processTrackerMap(active);
  processTrackerMap(inactive);
}

function decayProcCounts(members, effectTrackers, action) {
  const { team, active, inactive, byMember } = effectTrackers;
  const { actionKey } = action;

  function decayMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (effectTracker.procsRemaining === Infinity) continue;

      const effectOwner = effectKey.slice(0, 4);
      const { actionFilter, procs } = members[effectOwner].effectDefinitions[effectKey];
      if (actionFilter && !actionFilter.includes(actionKey)) continue;

      if (!procs) effectTracker.procsRemaining -= 1;
      if (effectTracker.procsRemaining <= 0) delete trackerMap[effectKey];
    }
  }

  decayMap(team);
  decayMap(active);
  decayMap(inactive);
  for (const map of Object.values(byMember)) decayMap(map);
}
