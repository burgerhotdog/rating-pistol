import { toArray } from '@/utils';

const TRIGGERS = ['apply', 'use', 'remove'];
const FILTERS = ['Type', 'Cast', 'Considered', 'Action'];
const ACTIONS = ['followUp', 'interval'];

const normalizeActionKey = (charId, shortKey) => {
  if (shortKey.split('-').length === 3) return shortKey;
  return `${charId}-${shortKey}`;
};

const normalizeEffect = (rawEffect, charId = null) => {
  const resolved = { ...rawEffect };

  resolved.rank = rawEffect.rank ?? 0;
  resolved.chance = rawEffect.chance ?? 1;
  resolved.applyTo = rawEffect.applyTo ?? 'self';

  if (rawEffect.applyWhen) {
    resolved.applyWhen = rawEffect.applyWhen;
  } else {
    resolved.isPassive = true;
  }

  resolved.applyCooldown = rawEffect.applyCooldown ?? 0;
  resolved.duration = rawEffect.duration ?? Infinity;
  resolved.maxUses = rawEffect.maxUses ?? Infinity;
  resolved.maxStacks = rawEffect.maxStacks ?? 1;
  
  for (const TRIGGER of TRIGGERS) {
    for (const FILTER of FILTERS) {
      const triggerOnFilter = `${TRIGGER}On${FILTER}`;
      const rawValue = rawEffect[triggerOnFilter];
      if (rawValue == null) continue;

      const resolvedValue = toArray(rawValue);
      if (FILTER === 'Action') {
        for (const [i, shortKey] of resolvedValue.entries()) {
          resolvedValue[i] = normalizeActionKey(charId, shortKey);
        }
      }

      resolved[triggerOnFilter] = resolvedValue;
    }
  }

  for (const ACTION of ACTIONS) {
    const field = `${ACTION}Action`;
    const rawValue = rawEffect[field];
    if (rawValue == null) continue;

    const resolvedValue = toArray(rawValue).map(a => {
      if (typeof a === 'string') return normalizeActionKey(charId, a);
      return a;
    });
    resolved[field] = resolvedValue;

    const fieldCooldown = `${ACTION}Cooldown`;
    resolved[fieldCooldown] = rawEffect[fieldCooldown] ?? 0;
  }

  if (rawEffect.statMap) {
    resolved.statMap = { ...rawEffect.statMap };
  }

  return resolved;
};

export const normalizeCharacters = (gameId, rawJson) => {
  const resolved = {};

  for (const charEntry of rawJson) {
    const { id } = charEntry;

    const effects = [];
    for (const effect of toArray(charEntry.effects)) {
      effects.push(normalizeEffect(effect, id));
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

      for (const [actionId, actionRaw] of Object.entries(skillRaw)) {
        const actionDef = {};

        actionDef.key = `${id}-${skillId}-${actionId}`;
        actionDef.owner = id;
        actionDef.skill = skillId;

        actionDef.name = actionRaw.name;
        actionDef.type = actionRaw.type ?? 'damage';

        actionDef.cast = toArray(actionRaw.cast);
        actionDef.considered = toArray(actionRaw.considered);
        actionDef.times = actionRaw.times ?? 1;

        if (actionDef.type === 'damage') {
          const actionElement = actionRaw.element ?? charElement;

          actionDef.element = actionElement;
          actionDef.considered.push(actionElement);
        }

        if (actionRaw.duration != null) {
          actionDef.duration = actionRaw.duration;
        } else if (!actionDef.cast.length) {
          actionDef.duration = 0;
        } else if (['OS', 'CA'].some(type => actionDef.cast.includes(type))) {
          actionDef.duration = 0;
        } else {
          actionDef.duration = 600;
        }

        if (actionRaw.offset != null) {
          actionDef.offset = actionRaw.offset;
        } else {
          actionDef.offset = actionDef.duration / 2;
        }

        if (actionRaw.multipliers) {
          actionDef.attr = actionRaw.attr ?? 'ATK';
          actionDef.multipliers = actionRaw.multipliers;
        }

        if (actionRaw.tags) {
          actionDef.tags = toArray(actionRaw.tags);
        }

        skillDef[actionId] = actionDef;
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
      effects.push(normalizeEffect(effect, id));
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
