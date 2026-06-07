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

const normalizeInlineAction = (memberId, effectKey, definition, index, rank = Infinity) => {
  let sumFlat = 0;
  let sumMv = 0;
  let sumTimes = 0;

  for (const { mv, flat, times = 1 } of definition.multipliers) {
    if (flat != null) sumFlat += resolveRankedValue(flat, rank) * times;
    if (mv != null) sumMv += resolveRankedValue(mv, rank) * times;
    sumTimes += times;
  }

  return {
    ...definition,
    key: `${effectKey}-INLINE-${index}`,
    owner: memberId,
    skill: definition.skill ?? 'INLINE',
    sumFlat,
    sumMv,
    sumTimes,
  };
};

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

function applyRankModifier(resolved, modifier) {
  for (const [key, value] of Object.entries(modifier)) {
    if (key === 'statMap') {
      resolved.statMap = mergeStatMaps(resolved.statMap, value);
      continue;
    }

    if (key === 'variableStatMap') {
      resolved.variableStatMap = mergeVariableStatMaps(resolved.variableStatMap, value);
      continue;
    }

    if (resolved[key] == null) {
      resolved[key] = value;
      continue;
    }

    if (typeof value === 'number') {
      resolved[key] += value;
      continue;
    }

    if (typeof value === 'string') {
      resolved[key].push(value);
      continue;
    }
  }
}

export const precomputeEffects = (gameId, member) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const castEffectsByAction = {};
  const contactEffectsByAction = {};
  const effectDefinitions = {};

  let effectIndex = 0;
  // Processes a list of raw effects (from character / weapon / set JSON), normalizes
  // each into effectDefinitions, and registers it in castEffectsByAction /
  // contactEffectsByAction based on what actions trigger it.
  function registerEffect(rawEffect, rank = Infinity) {
    const resolved = { ...rawEffect };

    const effectKey = `${memberId}-${effectIndex}`;
    resolved.effectKey = effectKey;

    const { statMap } = rawEffect;
    if (statMap) {
      const resolvedStatMap = {};

      for (const [stat, value] of Object.entries(statMap)) {
        resolvedStatMap[stat] = resolveRankedValue(value, rank);
      }

      resolved.statMap = resolvedStatMap;
    }

    resolved.statusMap = rawEffect.statusMap ?? {};
    resolved.applyIfEnemyStatus = rawEffect.applyIfEnemyStatus ?? null;
    resolved.applyIfInflict = rawEffect.applyIfInflict ?? null;
    resolved.variableStatMap = mergeVariableStatMaps(rawEffect.variableStatMap);

    const { followUpAction, intervalAction, times } = rawEffect;

    if (followUpAction) {
      resolved.followUpAction = followUpAction.map((action, index) => {
        if (typeof action === 'string') return action;
        return normalizeInlineAction(memberId, effectKey, action, index, rank);
      });
      resolved.times = times ?? 1;
    }

    if (intervalAction) {
      resolved.intervalAction = intervalAction.map((action, index) => {
        if (typeof action === 'string') return action;
        return normalizeInlineAction(memberId, effectKey, action, index, rank);
      });
      resolved.times = times ?? 1;
    }

    if (rawEffect.rankModifiers) {
      for (const [rankReq, modifier] of Object.entries(rawEffect.rankModifiers)) {
        if (Number(rankReq) <= rank) {
          applyRankModifier(resolved, modifier);
        }
      }
    }

    const { applyWhen, applyOnType, applyOnCast, applyOnConsidered, applyOnAction } = rawEffect;
    if (applyWhen) {
      const skillTree = ACTION[gameId][memberId];
      for (const skillDef of Object.values(skillTree)) {
        for (const actionDef of Object.values(skillDef)) {
          const { key, type, cast, considered } = actionDef;

          const typeMatch = applyOnType && applyOnType.includes(type);
          const castMatch = applyOnCast && cast.some(c => applyOnCast.includes(c));
          const consideredMatch = applyOnConsidered && considered.some(c => applyOnConsidered.includes(c));
          const actionMatch = applyOnAction && applyOnAction.includes(key);

          if (actionMatch || castMatch || typeMatch || consideredMatch) {
            if (applyWhen === 'cast') {
              (castEffectsByAction[key] ??= []).push(effectKey);
            }
            if (applyWhen === 'contact') {
              (contactEffectsByAction[key] ??= []).push(effectKey);
            }
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

  for (const effect of WEAPON[gameId][weaponId].effects) {
    registerEffect(effect, weaponRank);
  }

  for (const effect of getActiveSetBonuses(gameId, member).flat()) {
    registerEffect(effect);
  }

  return { castEffectsByAction, contactEffectsByAction, effectDefinitions };
};