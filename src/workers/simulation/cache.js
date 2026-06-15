import { resolveRankedValue, resolveRankedStatMap, mergeObj, mergeObjs } from '@/utils';
import { matchApplyOn } from './match';

const mergeVariableStatMaps = (...maps) => {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, details] of Object.entries(map)) {
      (acc[statId] ??= []).push(details);
    }
    return acc;
  }, {});
};

const compileSetEffects = (setCounts, data) => {
  const compiled = [];

  for (const setId in setCounts) {
    const count = setCounts[setId];
    const { tieredEffects } = data.set[setId];
    if (!tieredEffects) continue;

    for (const tier in tieredEffects) {
      if (count >= Number(tier)) {
        compiled.push(...tieredEffects[tier]);
      }
    }
  }

  return compiled;
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
const resolveActions = (data, member) => {
  const maxSkillIndex = data.misc.MAX_SKILL_LEVEL - 1;
  const { skillLevelMods } = data.character[member.id];
  const addBySkillId = {};
  const resolved = {};

  if (skillLevelMods) {
    for (const mod of skillLevelMods) {
      const { rank, skillId, add } = mod;
      if (rank > member.rank) continue;

      addBySkillId[skillId] = add;
    }
  }

  for (const skillId in data.action[member.id]) {
    const skillIndex = maxSkillIndex + (addBySkillId[skillId] ?? 0);
    const skill = data.action[member.id][skillId];

    for (const actionShort in skill) {
      const action = skill[actionShort];

      if (!action.multipliers) {
        resolved[actionShort] = action;
      } else {
        resolved[actionShort] = {
          ...action,
          compressedMultipliers: compressMultipliers(action, skillIndex),
        };
      }
    }
  }

  return resolved;
};

const resolveEffect = (effect, effectId, member, resolvedActions) => {
  const resolveEffectAction = (effectAction) => {
    const resolved = [];

    for (const [index, action] of effectAction.entries()) {
      const resolvedAction = {};

      if (typeof action === 'string') {
        Object.assign(resolvedAction, resolvedActions[action]);
      } else {
        const inlineId = String(index + 1);
        const inlineShort = `EFFECT_${effectId}-${inlineId}`;
        const inlineKey = `${member.id}:${inlineShort}`;

        Object.assign(resolvedAction, {
          ...action,
          key: inlineKey,
          short: inlineShort,
          id: inlineId,
          skillId: 'EFFECT',
          ownerId: member.id,
        });
      }

      if (action.multipliers && !action.compressedMultipliers) {
        resolvedAction.compressedMultipliers = compressMultipliers(resolvedAction, member);
      }

      resolved.push(resolvedAction);
    }

    return resolved;
  };

  const resolved = { ...effect };

  if (effect.rankedStatMap) {
    const resolvedStatMap = resolveRankedStatMap(effect.rankedStatMap, member.weaponRank);
    resolved.statMap = mergeObj(effect.statMap, resolvedStatMap);
  }

  if (effect.variableStatMap) {
    resolved.variableStatMap = mergeVariableStatMaps(effect.variableStatMap);
  }

  if (effect.followUpAction) {
    resolved.followUpAction = resolveEffectAction(effect.followUpAction);
  }

  if (effect.intervalAction) {
    resolved.intervalAction = resolveEffectAction(effect.intervalAction);
  }

  if (effect.rankMods) {
    for (const rank in effect.rankMods) {
      if (Number(rank) > member.rank) continue;

      const mod = effect.rankMods[rank];

      for (const key in mod) {
        const oldValue = resolved[key];
        const newValue = mod[key];

        if (oldValue == null) {
          resolved[key] = newValue;
        } else if (key === 'variableStatMap') {
          resolved.variableStatMap = mergeVariableStatMaps(oldValue, newValue);
        } else if (typeof oldValue === 'object' && !Array.isArray(oldValue)) {
          resolved[key] = mergeObj(oldValue, newValue);
        } else if (typeof newValue === 'number') {
          resolved[key] += newValue;
        } else if (typeof newValue === 'string') {
          resolved[key].push(newValue);
        } else {
          resolved[key].push(...newValue);
        }
      }
    }
  }

  return resolved;
};

const compileEffects = (data, member, idList, resolvedActions) => {
  const passivesbyTarget = {};
  const effectsByAction = {};

  const resolveApplyTo = (applyTo) => {
    if (applyTo === 'self') return [member.id];
    if (applyTo === 'team') return idList;
    if (applyTo === 'ally') return idList.filter(id => id !== member.id);
    if (applyTo === 'first') return [idList[0]];
    if (applyTo === 'next') return [idList.at(idList.indexOf(member.id) - 1)];
    return [applyTo];
  };

  for (const [index, effect] of [
    ...data.character[member.id].effects.filter(effect => effect.rank <= member.rank),
    ...data.weapon[member.weaponId].effects,
    ...compileSetEffects(member.setCounts, data),
  ].entries()) {
    const effectId = String(index + 1);
    const effectKey = `${member.id}:${effectId}`;

    const resolved = {
      ...resolveEffect(effect, effectId, member, resolvedActions),
      key: effectKey,
      id: effectId,
      ownerId: member.id,
      applyTo: resolveApplyTo(effect.applyTo),
    };

    // passive
    if (!resolved.applyWhen) {
      for (const target of resolved.applyTo) {
        passivesbyTarget[target] ??= []
        passivesbyTarget[target].push(resolved);
      }
      continue;
    }

    // active
    for (const skillId in data.action[member.id]) {
      const skill = data.action[member.id][skillId];

      for (const actionShort in skill) {
        const action = skill[actionShort];
        if (!matchApplyOn(action, resolved)) continue;

        effectsByAction[action.key] ??= [];
        effectsByAction[action.key].push(resolved);
      }
    }
  }

  return { passivesbyTarget, effectsByAction };
};

export const compileCache = (data, team) => {
  const idList = team.map(member => member.id);
  const action = {};
  const effect = {};
  const passive = {};
  const baseMap = {};
  const memberMap = {};

  for (const member of team) {
    const resolvedActions = resolveActions(data, member);
    action[member.id] = resolvedActions;

    const { passivesbyTarget, effectsByAction } = compileEffects(data, member, idList, resolvedActions);

    for (const target in passivesbyTarget) {
      passive[target] ??= [];
      passive[target].push(...passivesbyTarget[target]);
    }

    for (const actionKey in effectsByAction) {
      effect[actionKey] = effectsByAction[actionKey];
    }

    baseMap[member.id] = mergeObjs(
      data.misc.DEFAULT_STATS,
      data.character[member.id].stats,
      data.weapon[member.weaponId].stats,
    );

    memberMap[member.id] = member;
  }

  return { action, effect, passive, baseMap, member: memberMap, misc: data.misc };
};
