import { CHARACTER, WEAPON, SET } from '@/data';
import { toArray, mergeObj } from '@/utils';
import { enableIf } from './enableIf';
import { applyOn } from './applyOn';
import { normalizeAction, compressMultipliers } from './actions';
import { resolveRankedValue } from './resolveRanked';

const mergeVariableStatMaps = (...maps) => {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, details] of Object.entries(map)) {
      (acc[statId] ??= []).push(details);
    }
    return acc;
  }, {});
};

const resolveApplyTo = (applyTo, ownerId, memberIds) => {
  switch (applyTo) {
    case undefined:
      return [ownerId];

    case 'team':
      return memberIds;

    case 'ally':
      return memberIds.filter((id) => id !== ownerId);

    case 'first':
      return [memberIds[0]];

    case 'next':
      return [memberIds.at(memberIds.indexOf(ownerId) - 1)];

    default:
      return [applyTo];
  }
};

const normalizeEffect = (ctx, member, effectId, effect, actions) => {
  const { gameId, memberIds } = ctx;

  const resolved = {
    ...effect,
    ownerId: member.id,
    applyTo: resolveApplyTo(effect.applyTo, member.id, memberIds),
  };

  resolved.rank ??= 0;
  resolved.chance ??= 1;
  resolved.duration ??= Infinity;
  resolved.maxUses ??= Infinity;
  resolved.maxStacks ??= 1;

  if ('rankedStatMap' in effect) {
    const { rankedStatMap } = effect;
    const statMap = {};
  
    for (const [statId, valueParams] of Object.entries(rankedStatMap)) {
      statMap[statId] = resolveRankedValue(valueParams, member.weaponRank);
    }
  
    resolved.statMap = mergeObj(effect.statMap ?? {}, statMap);
  }

  if ('variableStatMap' in effect) {
    resolved.variableStatMap = mergeVariableStatMaps(effect.variableStatMap);
  }

  for (const actionType of ['followUpAction', 'intervalAction']) {
    if (actionType in effect) {
      const effectActions = toArray(effect[actionType]);
      resolved[actionType] = [];

      for (const [index, linkedAction] of effectActions.entries()) {
        if (typeof linkedAction === 'string') {
          resolved[actionType].push(actions[linkedAction]);
        } else {
          const inlineId = String(index + 1);
          const inlineShort = `effect${effectId}.${inlineId}`;
          const inlineKey = `${member.id}:${inlineShort}`;

          const inline = {
            ...normalizeAction(ctx, member.id, linkedAction),
            key: inlineKey,
            short: inlineShort,
            id: inlineId,
          };

          if (inline.type === 'damage') {
            inline.element ??= CHARACTER[gameId][member.id].element;
          }

          if ('rankedMultipliers' in inline) {
            inline.compressed = compressMultipliers(inline.rankedMultipliers, { attr: inline.attr, weaponId: member.weaponId })
          } else {
            inline.compressed = compressMultipliers(toArray(inline.fixedMultipliers), { attr: inline.attr });
          }

          resolved[actionType].push(inline);
        }
      }

      if (actionType === 'intervalAction') {
        resolved.intervalCooldown ??= 1000;
      }

      resolved.times ??= 1;
    }
  }

  if ('rankMods' in effect) {
    for (const [rank, mod] of Object.entries(effect.rankMods)) {
      if (Number(rank) > member.rank) {
        continue;
      }

      for (const [key, add] of Object.entries(mod)) {
        const prev = resolved[key];

        if (prev == null) {
          resolved[key] = add;
        } else if (key === 'variableStatMap') {
          resolved.variableStatMap = mergeVariableStatMaps(prev, add);
        } else if (typeof prev === 'object' && !Array.isArray(prev)) {
          resolved[key] = mergeObj(prev, add);
        } else if (typeof add === 'number') {
          resolved[key] += add;
        } else if (typeof add === 'string') {
          resolved[key].push(add);
        } else {
          resolved[key].push(...add);
        }
      }
    }
  }

  return resolved;
};

export const normalizeEffects = (ctx, member, actions) => {
  const toNormalize = [
    ...toArray(CHARACTER[ctx.gameId][member.id].effects)
      .filter((effect) => (effect.rank ?? 0) <= member.rank),
    ...toArray(WEAPON[ctx.gameId][member.weaponId].effects),
  ];

  for (const [setId, count] of Object.entries(member.setCounts)) {
    const { tieredEffects = {} } = SET[ctx.gameId][setId];

    for (const [tier, effects] of Object.entries(tieredEffects)) {
      if (Number(tier) > count) continue;
      toNormalize.push(...toArray(effects));
    }
  }

  const passivesbyTarget = {};
  const effectsByAction = {};
  const specialEffects = [];

  for (const [index, effect] of toNormalize.entries()) {
    const effectId = String(index + 1);
    const effectKey = `${member.id}:EFFECT_${effectId}`;

    if (!enableIf(effect, CHARACTER[ctx.gameId][member.id])) {
      continue;
    }

    const resolved = {
      ...normalizeEffect(ctx, member, effectId, effect, actions[member.id]),
      key: effectKey,
      id: effectId,
    };

    if ('applyOnSpecial' in resolved) {
      specialEffects.push(resolved);
      continue;
    }

    if ('applyWhen' in resolved) { // active
      const actionsList = resolved.applyBy === 'team'
        ? Object.values(actions).flatMap((actionMap) => Object.values(actionMap))
        : Object.values(actions[member.id]);

      for (const action of actionsList) {
        if (!applyOn(resolved, action)) {
          continue;
        }

        effectsByAction[action.key] ??= [];
        effectsByAction[action.key].push(resolved);
      }
    } else { // passive
      const targets = resolved.applyTo;

      for (const target of targets) {
        passivesbyTarget[target] ??= []
        passivesbyTarget[target].push(resolved);
      }
    }
  }

  return { passivesbyTarget, effectsByAction, specialEffects };
};
