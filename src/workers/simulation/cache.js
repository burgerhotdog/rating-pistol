import { CHARACTER, ACTION, WEAPON, SET } from '@/data';
import { resolveRankedValue, mergeStatMaps, getSetCounts, resolveRankedStatMap } from '@/utils';

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

const getMultiplier = (unknown, source, param) => {
  if (source === 'action') return unknown[param];
  if (source === 'weapon') return resolveRankedValue(unknown, param);
  return unknown;
};

const compileAction = (action, source, param) => {
  let sumFlat = 0;
  let sumMv = 0;
  let sumTimes = 0;

  for (const { mv, flat, times = 1 } of action.multipliers) {
    if (flat != null) sumFlat += getMultiplier(flat, source, param) * times;
    if (mv != null) sumMv += getMultiplier(mv, source, param) * times;
    sumTimes += times;
  }

  return { ...action, sumFlat, sumMv, sumTimes };
};

const compileActions = (gameId, memberId, memberRank) => {
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
  for (const actionKey in ACTION[gameId][memberId]) {
    const action = ACTION[gameId][memberId][actionKey];
    const levelIndex = maxLevel + (addBySkillId[action.skill] ?? 0) - 1;
    resolved[action.key] = compileAction(action, 'action', levelIndex);
  }

  return resolved;
};

function applyRankModifier(resolved, modifier) {
  for (const key in modifier) {
    if (key === 'statMap') {
      resolved.statMap = mergeStatMaps(resolved.statMap, modifier.statMap);
      continue;
    }

    if (key === 'variableStatMap') {
      resolved.variableStatMap = mergeVariableStatMaps(resolved.variableStatMap, modifier.variableStatMap);
      continue;
    }

    if (key === 'statusMap') {
      resolved.statusMap = mergeStatMaps(resolved.statusMap, modifier.statusMap);
      continue;
    }

    if (resolved[key] == null) {
      resolved[key] = modifier[key];
      continue;
    }

    if (typeof modifier[key] === 'number') {
      resolved[key] += modifier[key];
      continue;
    }

    if (typeof modifier[key] === 'string') {
      resolved[key].push(modifier[key]);
      continue;
    }
  }
}

const compileEffects = (gameId, member) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const definitions = {};
  const passive = {
    'enemy': [],
    'team': [],
    'self': [],
    'active': [],
    'inactive': [],
    'first': [],
  };
  const active = {};

  let effectIndex = 0;
  // Processes a list of raw effects (from character / weapon / set JSON), normalizes
  // each into effectDefinitions, and registers it in castEffectsByAction /
  // hitEffectsByAction based on what actions trigger it.
  function registerEffect(rawEffect, source, rank = Infinity) {
    const id = String(effectIndex + 1);
    const resolved = {
      ...rawEffect,
      owner: memberId,
      id,
    };

    if (source === 'weapon') {
      const resolvedStatMap = resolveRankedStatMap(rawEffect.rankedStatMap, rank);
      resolved.statMap ??= mergeStatMaps(rawEffect.statMap, resolvedStatMap);
    }

    resolved.variableStatMap = mergeVariableStatMaps(rawEffect.variableStatMap);
    
    resolved.followUpAction &&= rawEffect.followUpAction.map(action => {
      if (typeof action === 'string') return action;
      return {
        ...compileAction(action, source, rank),
        key: `EFFECT-${id}`,
        owner: memberId,
        skill: 'EFFECT',
      };
    });

    resolved.intervalAction &&= rawEffect.intervalAction.map(action => {
      if (typeof action === 'string') return action;
      return {
        ...compileAction(action, source, rank),
        key: `EFFECT-${id}`,
        owner: memberId,
        skill: 'EFFECT',
      };
    });

    if (rawEffect.rankModifiers) {
      for (const [rankReq, modifier] of Object.entries(rawEffect.rankModifiers)) {
        if (Number(rankReq) <= rank) {
          applyRankModifier(resolved, modifier);
        }
      }
    }

    const { applyWhen, applyOnAction, applyOnType, applyOnTagged, applyOnCast, applyOnConsidered } = rawEffect;
    if (applyWhen) {
      for (const actionKey in ACTION[gameId][memberId]) {
        const action = ACTION[gameId][memberId][actionKey];

        const actionMatch = applyOnAction && applyOnAction.includes(action.key);
        const typeMatch = applyOnType && applyOnType.includes(action.type);
        const taggedMatch = applyOnTagged && action.tagged.some(t => applyOnTagged.includes(t));
        const castMatch = applyOnCast && action.cast.some(c => applyOnCast.includes(c));
        const consideredMatch = applyOnConsidered && action.considered.some(c => applyOnConsidered.includes(c));

        if (actionMatch || typeMatch || taggedMatch || castMatch || consideredMatch) {
          active[action.key] ??= {};

          if (applyWhen === 'cast') {
            (active[action.key].cast ??= []).push(resolved);
          } else {
            (active[action.key].hit ??= []).push(resolved);
          }
        }
      }
    } else {
      passive[resolved.applyTo] ??= [];
      passive[resolved.applyTo].push(resolved);
    }

    definitions[id] = resolved;
    effectIndex++;
  }

  for (const effect of CHARACTER[gameId][memberId].effects) {
    if (effect.rank > rank) continue;
    registerEffect(effect, 'character', rank);
  }

  for (const effect of WEAPON[gameId][weaponId].effects) {
    registerEffect(effect, 'weapon', weaponRank);
  }

  for (const effect of getActiveSetBonuses(gameId, member).flat()) {
    registerEffect(effect, 'set');
  }

  return { definitions, passive, active };
};

export const compileCache = (gameId, team) => {
  const cache = { action: {}, effect: {}, link: {} };

  for (const member of team) {
    const { memberId, rank } = member;
    if (!memberId) continue;

    cache.action[memberId] = compileActions(gameId, memberId, rank);
    const { definitions, passive, active } = compileEffects(gameId, member);
    cache.effect[memberId] = definitions;
    cache.link[memberId] = { passive, active };
  }

  return cache;
};
