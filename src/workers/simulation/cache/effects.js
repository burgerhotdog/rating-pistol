import { CHARACTER, WEAPON, SET } from '@/data';
import { toArray, mergeObj } from '@/utils';
import { matchApplyOn } from '../match';
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

const resolveApplyTo = (applyTo, ownerId, idList) => {
  switch (applyTo) {
    case 'team':
      return idList;

    case 'ally':
      return idList.filter(id => id !== ownerId);

    case 'first':
      return [idList[0]];

    case 'next':
      return [idList.at(idList.indexOf(ownerId) - 1)];

    case 'active':
      return [applyTo];

    case 'inactive':
      return [applyTo];

    case 'enemy':
      return [applyTo];

    default:
      return [ownerId];
  }
};

const normalizeEffect = (ctx, member, effectId, effect, actions) => {
  const { gameId, idList } = ctx;

  const resolved = {
    ...effect,
    ownerId: member.id,
    applyTo: resolveApplyTo(effect.applyTo, member.id, idList),
  };

  resolved.rank ??= 0;
  resolved.chance ??= 1;
  resolved.duration ??= Infinity;
  resolved.maxUses ??= Infinity;
  resolved.maxStacks ??= 1;

  for (const TRIGGER of ['apply', 'use', 'remove']) {
    for (const FILTER of ['Action', 'Type', 'Tagged', 'Cast', 'Considered']) {
      const key = `${TRIGGER}On${FILTER}`;
      const value = effect[key];
      if (value == null) continue;

      resolved[key] = toArray(value);
    }
  }

  if (effect.useOnElement) {
    resolved.useOnElement = toArray(effect.useOnElement);
  }

  if (effect.useIfElement) {
    resolved.useIfElement = toArray(effect.useIfElement);
  }

  if (effect.useIfWeapon) {
    resolved.useIfWeapon = toArray(effect.useIfWeapon);
  }

  if (effect.useIfTagged) {
    resolved.useIfTagged = toArray(effect.useIfTagged);
  }

  if (effect.applyIfInflict) {
    resolved.applyIfInflict = toArray(effect.applyIfInflict);
  }

  if ('rankedStatMap' in effect) {
    const { rankedStatMap } = effect;
    const statMap = {};
  
    for (const statId in rankedStatMap) {
      statMap[statId] = resolveRankedValue(rankedStatMap[statId], member.weaponRank);
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
          const inlineShort = `EFFECT_${effectId}-${inlineId}`;
          const inlineKey = `${member.id}:${inlineShort}`;

          const inline = {
            ...normalizeAction(ctx, member.id, linkedAction),
            key: inlineKey,
            short: inlineShort,
            id: inlineId,
          };

          const spec = { element: inline.element, attr: inline.attr };

          if (inline.type === 'damage') {
            spec.element ??= CHARACTER[gameId][member.id].element;
          } else {
            spec.element = inline.type;
          }

          if ('rankedMultipliers' in inline) {
            spec.weaponId = member.weaponId;
            inline.compressed = compressMultipliers(inline.indexedMultipliers, spec)
          } else {
            inline.compressed = compressMultipliers(toArray(inline.fixedMultipliers), spec);
          }

          resolved[actionType].push(inline);
        }
      }

      if (actionType === 'intervalAction') {
        resolved.intervalCooldown ??= 1000;
        resolved.intervalOffset ??= 0;
      }

      resolved.times ??= 1;
    }
  }

  if ('rankMods' in effect) {
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

export const normalizeEffects = (ctx, member, actions) => {
  const { gameId } = ctx;

  const charData = CHARACTER[gameId][member.id];
  const weapData = WEAPON[gameId][member.weaponId];
  const setData = SET[gameId];

  const toNormalize = [
    ...toArray(charData.effects).filter(effect => (effect.rank ?? 0) <= member.rank),
    ...toArray(weapData.effects),
  ];

  for (const [setId, count] of Object.entries(member.setCounts)) {
    const { tieredEffects = {} } = setData[setId];

    for (const [tier, effects] of Object.entries(tieredEffects)) {
      if (Number(tier) > count) continue;
      toNormalize.push(...toArray(effects));
    }
  }

  const passivesbyTarget = {};
  const effectsByAction = {};

  for (const [index, effect] of toNormalize.entries()) {
    const effectId = String(index + 1);
    const effectKey = `${member.id}:EFFECT_${effectId}`;

    const resolved = {
      ...normalizeEffect(ctx, member, effectId, effect, actions),
      key: effectKey,
      id: effectId,
    };

    if ('applyWhen' in resolved) { // active
      for (const actionShort in actions) {
        const action = actions[actionShort];
        if (!matchApplyOn(action, resolved)) continue;

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

  return { passivesbyTarget, effectsByAction };
};
