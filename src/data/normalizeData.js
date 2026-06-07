import { toArray } from '@/utils';

const TRIGGERS = ['apply', 'use', 'remove'];
const FILTERS = ['Action', 'Type', 'Tagged', 'Cast', 'Considered'];
const ACTIONS = ['followUp', 'interval'];

const normalizeActionKey = (charId, shortKey) => {
  if (shortKey.split('-').length === 3) return shortKey;
  return `${charId}-${shortKey}`;
};

const normalizeInlineAction = (action, element = 'PHYSICAL') => {
  const resolved = {
    ...action,
    tagged: toArray(action.tagged),
    cast: toArray(action.cast),
    considered: toArray(action.considered),
    multipliers: toArray(action.multipliers),
  };

  resolved.type ??= 'damage';
  resolved.times ??= 1;

  if (action.multipliers) resolved.attr ??= 'ATK';
  if (!action.cast || ['OS', 'CA'].some(c => resolved.cast.includes(c))) {
    resolved.duration ??= 0;
  }
  resolved.duration ??= 750;
  resolved.offset ??= resolved.duration * 0.75;

  if (resolved.type === 'damage') resolved.element ??= element;

  return resolved;
};

const normalizeEffect = (effect, charId = null, element = null) => {
  const resolved = {
    ...effect,
  };

  resolved.rank ??= 0;
  resolved.chance ??= 1;
  resolved.applyTo ??= 'self';

  if (!resolved.applyWhen) resolved.isPassive = true;

  resolved.applyCooldown ??= 0;
  resolved.duration ??= Infinity;
  resolved.maxUses ??= Infinity;
  resolved.maxStacks ??= 1;
  
  // apply, use, remove
  // Type, Cast, Considered, Action
  for (const TRIGGER of TRIGGERS) {
    for (const FILTER of FILTERS) {
      const key = `${TRIGGER}On${FILTER}`;
      const value = effect[key];
      if (value == null) continue;

      const resolvedValue = toArray(value);

      if (FILTER === 'Action') {
        for (const [index, shortKey] of resolvedValue.entries()) {
          resolvedValue[index] = normalizeActionKey(charId, shortKey);
        }
      }

      resolved[key] = resolvedValue;
    }
  }

  // followUp, interval
  for (const ACTION of ACTIONS) {
    const key = `${ACTION}Action`;
    const value = effect[key];
    if (value == null) continue;

    resolved[key] = toArray(value).map(a => {
      if (typeof a === 'string') return normalizeActionKey(charId, a);
      return normalizeInlineAction(a, element);
    });

    resolved[`${ACTION}Cooldown`] ??= 0;
    resolved.times ??= 1;
  }

  return resolved;
};

export const normalizeCharacters = (gameId, rawJson) => {
  const resolved = {};

  for (const charEntry of rawJson) {
    const { id, element } = charEntry;

    const effects = [];
    for (const effect of toArray(charEntry.effects)) {
      effects.push(normalizeEffect(effect, id, element));
    }

    resolved[id] = { ...charEntry, effects };
  }

  return resolved;
};

export const normalizeActions = (gameId, characters, rawJson) => {
  const resolved = {};

  for (const charEntry of rawJson) {
    const { id, ...rawSkillTree } = charEntry;
    const charDef = {};
    const charElement = characters[gameId][id].element;

    for (const [skillId, skillRaw] of Object.entries(rawSkillTree)) {
      const skillDef = {};

      for (const [actionId, action] of Object.entries(skillRaw)) {
        const resolvedAction = {
          ...action,
          key: `${id}-${skillId}-${actionId}`,
          owner: id,
          skill: skillId,
          tagged: toArray(action.tagged),
          cast: toArray(action.cast),
          considered: toArray(action.considered),
        };

        resolvedAction.type ??= 'damage';
        resolvedAction.times ??= 1;

        if (resolvedAction.type === 'damage') resolvedAction.element ??= charElement;

        if (!action.cast || ['OS', 'CA'].some(c => resolvedAction.cast.includes(c))) {
          resolvedAction.duration ??= 0;
        }
        resolvedAction.duration ??= 750;
        resolvedAction.offset ??= resolvedAction.duration * 0.75;

        if (action.multipliers) resolvedAction.attr ??= 'ATK';

        skillDef[actionId] = resolvedAction;
      }

      charDef[skillId] = skillDef;
    }

    resolved[id] = charDef;
  }

  return resolved;
};

export const normalizeWeapons = (gameId, rawJson) => {
  const resolved = {};

  for (const weapEntry of rawJson) {
    const { id } = weapEntry;

    const effects = [];
    for (const effect of toArray(weapEntry.effects)) {
      effects.push(normalizeEffect(effect));
    }

    resolved[id] = { ...weapEntry, effects };
  }

  return resolved;
};

export const normalizeSets = (gameId, rawJson) => {
  const resolved = {};

  for (const setEntry of rawJson) {
    const { id } = setEntry;
    const setBonus = {};

    for (const [bonusNum, bonusEffects] of Object.entries(setEntry.setBonus)) {
      const effects = [];

      for (const bonusEffect of toArray(bonusEffects)) {
        effects.push(normalizeEffect(bonusEffect));
      }

      setBonus[bonusNum] = effects;
    }

    resolved[id] = { ...setEntry, setBonus };
  }

  return resolved;
};
