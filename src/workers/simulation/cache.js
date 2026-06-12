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

const compressMultipliers = (action, param) => {
  const resolveHitScaling = (unknown, param) => {
    if (typeof unknown === 'number') return unknown;
    if (unknown.length === 2) return resolveRankedValue(unknown, param);
    return unknown[param];
  };

  const compressedMultipliers = {};

  for (const hit of action.multipliers) {
    const { element = action.element, times = 1 } = hit;
    compressedMultipliers[element] ??= { flat: 0, mv: {}, hitCount: 0 };

    if (hit.flat) {
      const flatValue = resolveHitScaling(hit.flat, param);
      compressedMultipliers[element].flat += flatValue * times;
    }

    if (hit.mv) {
      if (typeof hit.mv === 'number') {
        compressedMultipliers[element].mv[action.attr] ??= 0;
        compressedMultipliers[element].mv[action.attr] += hit.mv * times;
      } else if (Array.isArray(hit.mv)) {
        compressedMultipliers[element].mv[action.attr] ??= 0;
        if (hit.mv.length === 2) {
          compressedMultipliers[element].mv[action.attr] += resolveRankedValue(hit.mv, param) * times;
        } else {
          compressedMultipliers[element].mv[action.attr] += hit.mv[param] * times;
        }
      } else {
        for (const attr in hit.mv) {
          const attrMv = resolveHitScaling(hit.mv[attr], param);

          compressedMultipliers[element].mv[attr] ??= 0;
          compressedMultipliers[element].mv[attr] += attrMv * times;
        }
      }
    }

    compressedMultipliers[element].hitCount += times;
  }

  return compressedMultipliers;
};

// Resolve multiplier arrays using skill level index
const resolveActions = (gameId, memberId, memberRank) => {
  const maxLevelIndex = gameId === 'zenless-zone-zero' ? 11 : 9;
  const { skillLevelMods } = CHARACTER[gameId][memberId];
  const skillMap = ACTION[gameId][memberId];
  const addBySkillId = {};
  const resolved = {};

  if (skillLevelMods) {
    for (const mod of skillLevelMods) {
      const { rank, skillId, add } = mod;

      if (rank <= memberRank) {
        addBySkillId[skillId] = add;
      }
    }
  }

  for (const skillId in skillMap) {
    const skillLevelIndex = maxLevelIndex + (addBySkillId[skillId] ?? 0);
    const skill = skillMap[skillId];

    for (const actionKey in skill) {
      const action = skill[actionKey];

      if (!action.multipliers) {
        resolved[actionKey] = action;
      } else {
        resolved[actionKey] = {
          ...action,
          compressedMultipliers: compressMultipliers(action, skillLevelIndex),
        };
      }
    }
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


const resolveEffect = (effect, id, memberId, rank) => {
  const resolveEffectAction = (effectAction) => {
    const resolved = [];

    for (const action of effectAction) {
      if (typeof action === 'string') {
        resolved.push(action);
      } else {
        const resolvedAction = {
          ...action,
          key: `EFFECT-${id}`,
          skillId: 'EFFECT',
          id,
          ownerId: memberId,
        };

        if (action.multipliers) {
          resolvedAction.compressedMultipliers = compressMultipliers(action, rank);
        }

        resolved.push(resolvedAction);
      }
    }

    return resolved;
  };

  const resolved = { ...effect };

  if (effect.rankedStatMap) {
    const resolvedStatMap = resolveRankedStatMap(effect.rankedStatMap, rank);
    resolved.statMap = mergeStatMaps(effect.statMap, resolvedStatMap);
  }

  if (effect.followUpAction) {
    resolved.followUpAction = resolveEffectAction(effect.followUpAction);
  }

  if (effect.intervalAction) {
    resolved.intervalAction = resolveEffectAction(effect.intervalAction);
  }

  if (effect.rankModifiers) {
    for (const [rankReq, modifier] of Object.entries(effect.rankModifiers)) {
      if (Number(rankReq) <= rank) {
        applyRankModifier(resolved, modifier);
      }
    }
  }

  return resolved;
};

const compileEffects = (gameId, member, idList) => {
  const { memberId, rank, weaponId, weaponRank } = member;
  const memberIndex = idList.indexOf(memberId);
  const teamSize = idList.length;
  const definitions = {};
  const passive = {};
  const active = {};
  let effectIndex = 0;

  const resolveApplyTo = (applyTo) => {
    if (applyTo === 'team') return idList;
    if (applyTo === 'self') return [memberId];
    if (applyTo === 'ally') return idList.filter(id => id !== memberId);
    if (applyTo === 'first') return [idList[0]];
    if (applyTo === 'next') return [idList[(memberIndex - 1 + teamSize) % teamSize]];
    return [applyTo];
  };

  function registerEffect(rawEffect, source, rank = Infinity) {
    const id = String(effectIndex + 1);
    const resolved = {
      ...resolveEffect(rawEffect, id, memberId, rank),
      owner: memberId,
      key: `${memberId}-${id}`,
      id,
      applyTo: resolveApplyTo(rawEffect.applyTo),
    };

    resolved.variableStatMap = mergeVariableStatMaps(rawEffect.variableStatMap);

    const { applyOnAction, applyOnType, applyOnTagged, applyOnCast, applyOnConsidered } = rawEffect;

    if (!rawEffect.applyWhen) {
      for (const target of resolved.applyTo) {
        (passive[target] ??= []).push(resolved);
      }
    } else {
      const skillMap = ACTION[gameId][memberId];
      for (const skillId in skillMap) {
        const skill = skillMap[skillId];

        for (const actionKey in skill) {
          const action = skill[actionKey];

          const actionMatch = applyOnAction && applyOnAction.includes(action.key);
          const typeMatch = applyOnType && applyOnType.includes(action.type);
          const taggedMatch = applyOnTagged && action.tagged.some(t => applyOnTagged.includes(t));
          const castMatch = applyOnCast && action.cast.some(c => applyOnCast.includes(c));
          const consideredMatch = applyOnConsidered && action.considered && action.considered.some(c => applyOnConsidered.includes(c));

          if (actionMatch || typeMatch || taggedMatch || castMatch || consideredMatch) {
            active[action.key] ??= { cast: [], hit: [] };

            if (rawEffect.applyWhen === 'cast') {
              active[action.key].cast.push(resolved);
            } else {
              active[action.key].hit.push(resolved);
            }
          }
        }
      }
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

export const compileCache = (gameId, rawTeam) => {
  const team = rawTeam.filter(m => m.memberId);
  const idList = team.map(m => m.memberId);
  const action = {};
  const effect = {};
  const link = {};

  for (const member of team) {
    const { memberId, rank } = member;

    action[memberId] = resolveActions(gameId, memberId, rank);
    const { definitions, passive, active } = compileEffects(gameId, member, idList);
    effect[memberId] = definitions;
    link[memberId] = { passive, active };
  }

  return { action, effect, link };
};
