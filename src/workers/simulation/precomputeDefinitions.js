import { CHARACTER, ACTION, WEAPON, SET } from '@/data';
import { resolveRankedValue, mergeStatMaps, toArray, getSetCounts } from '@/utils';

const mergeVariableStatMaps = (...maps) => {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, details] of Object.entries(map)) {
      (acc[statId] ??= []).push(details);
    }
    return acc;
  }, {});
};

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
    const setBonuses = SET[gameId]?.[setId]?.setBonus;
    if (!setBonuses) continue;
    for (const [numPiecesToActivate, setBonusData] of Object.entries(setBonuses)) {
      if (activePieces < Number(numPiecesToActivate)) continue;
      activeBonuses.push(setBonusData);
    }
  }
  return activeBonuses;
};

const normalizeInlineProcAction = (memberId, effectKey, proc, procIndex, rank = Infinity) => {
  const inline = proc.action;
  if (!inline) return null;

  const cast = toArray(inline.cast);
  const considered = toArray(inline.considered ?? cast);

  let sumFlat = 0;
  let sumMv = 0;
  let sumTimes = 0;

  for (const { mv, flat, times = 1 } of toArray(inline.multipliers)) {
    if (mv != null) sumMv += resolveRankedValue(mv, rank) * times;
    if (flat != null) sumFlat += resolveRankedValue(flat, rank) * times;
    sumTimes += times;
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
    sumMv,
    sumTimes,
    sumFlat,
    times: inline.times ?? 1,
  };
};

const normalizeProc = (memberId, effectKey, proc, procIndex, rank = Infinity) => ({
  useOnConsidered: proc.useOnConsidered && toArray(proc.useOnConsidered),
  useOnCast: proc.useOnCast && toArray(proc.useOnCast),
  useOnAction: proc.useOnAction && toArray(proc.useOnAction).map(sk => `${memberId}-${sk}`),
  action: toArray(proc.action),
  inlineAction: normalizeInlineProcAction(memberId, effectKey, proc, procIndex, rank),
  times: proc.times ?? 1,
});

export const precomputeActions = (gameId, memberId, memberRank) => {
  const resolved = {};

  // Determine effective skill level: base max + any rank-unlocked additions
  const maxLevel = gameId === 'zenless-zone-zero' ? 12 : 10;
  const addBySkillId = {};

  const { skillLevelMods = [] } = CHARACTER[gameId][memberId];
  for (const { rank, skillId, add } of skillLevelMods) {
    if (rank > memberRank) continue;
    addBySkillId[skillId] = add;
  }

  // Sum mv/flat multipliers at the resolved level for each action
  const skillTree = ACTION[gameId][memberId];
  for (const [skillId, actions] of Object.entries(skillTree)) {
    const levelIndex = maxLevel + (addBySkillId[skillId] ?? 0) - 1;

    for (const action of Object.values(actions)) {
      const { key, multipliers = [] } = action;

      let sumFlat = 0;
      let sumMv = 0;
      let sumTimes = 0;
      for (const { flat, mv, times = 1 } of multipliers) {
        if (flat) sumFlat += flat[levelIndex] * times;
        if (mv) sumMv += mv[levelIndex] * times;
        sumTimes += times;
      }

      resolved[key] = {
        ...action,
        sumFlat,
        sumMv,
        sumTimes,
      };
    }
  }

  return resolved;
};

export const precomputeEffects = (gameId, member) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const castEffectsByAction = {};
  const contactEffectsByAction = {};
  const effectDefinitions = {};

  // Applies a rankModifiers entry on top of an already-resolved effect definition,
  // adjusting duration, maxUses, statMap, variableStatMap
  function applyRankModifier(resolved, modifier = {}) {
    const { duration, maxUses, statMap, variableStatMap } = modifier;
    if (duration) resolved.duration += duration;
    if (maxUses) resolved.maxUses += maxUses;
    if (statMap) resolved.statMap = mergeStatMaps(resolved.statMap, statMap);
    if (variableStatMap) {
      resolved.variableStatMap = mergeVariableStatMaps(resolved.variableStatMap, variableStatMap);
    }
  }

  let effectIndex = 0;
  // Processes a list of raw effects (from character / weapon / set JSON), normalizes
  // each into effectDefinitions, and registers it in castEffectsByAction /
  // contactEffectsByAction based on what actions trigger it.
  function registerEffect(rawEffect, rank = Infinity) {
    const resolved = { ...rawEffect };

    const effectKey = `${memberId}-${effectIndex}`;
    resolved.effectKey = effectKey;

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
    resolved.intervalAction = toArray(rawEffect.intervalAction).map((proc, procIndex) => normalizeProc(memberId, effectKey, proc, 200 + procIndex, rank));

    if (rawEffect.rankModifiers) {
      for (const [rankReq, modifier] of Object.entries(rawEffect.rankModifiers)) {
        if (Number(rankReq) <= rank) applyRankModifier(resolved, modifier);
      }
    }

    const applyWhen = rawEffect.applyWhen;
    const applyOnAction = toArray(rawEffect.applyOnAction);
    const applyOnType = toArray(rawEffect.applyOnType);
    const applyOnCast = toArray(rawEffect.applyOnCast);
    const applyOnConsidered = toArray(rawEffect.applyOnConsidered);

    if (!applyWhen) {
      // No trigger condition — effect is always active (passive)
      resolved.isPassive = true;
    } else {
      // Walk every action to find which ones trigger this effect, and register
      // it in the appropriate By-Action map (cast or contact).
      const skillTree = ACTION[gameId][memberId];
      const inflictMatch = applyOnType.includes('inflict');
      for (const skillDef of Object.values(skillTree)) {
        for (const actionDef of Object.values(skillDef)) {
          const { key, type, cast, considered } = actionDef;
          const actionMatch = applyOnAction.includes(key);
          const typeMatch = applyOnType.includes(type);
          const castMatch = cast.some(c => applyOnCast.includes(c));
          const consideredMatch = considered.some(c => applyOnConsidered.includes(c));
          if (actionMatch || castMatch || typeMatch || consideredMatch || inflictMatch) {
            if (applyWhen === 'cast') (castEffectsByAction[key] ??= []).push(effectKey);
            if (applyWhen === 'contact') (contactEffectsByAction[key] ??= []).push(effectKey);
          }
        }
      }
    }

    effectDefinitions[effectKey] = resolved;
    effectIndex++;
  }

  for (const effect of CHARACTER[gameId][memberId].effects) {
    if (effect.rank > rank) continue;
    registerEffect(effect, rank);
  }

  for (const effect of toArray(WEAPON[gameId][weaponId].effects)) {
    registerEffect(effect, weaponRank);
  }

  for (const effect of getActiveSetBonuses(gameId, member).flatMap(toArray)) {
    registerEffect(effect);
  }

  return { castEffectsByAction, contactEffectsByAction, effectDefinitions };
};