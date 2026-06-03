import { toArray } from '@/utils';

const APPLY_TYPES = ['applyOnType', 'applyOnCast', 'applyOnConsidered'];

const normalizeEffect = (rawEffect, charId = null) => {
  const resolved = { ...rawEffect };

  if (rawEffect.rank != null) {
    resolved.rank = rawEffect.rank;
  }

  resolved.applyWhen = rawEffect.applyWhen;
  resolved.applyTo = rawEffect.applyTo ?? 'self';
  
  for (const TYPE of APPLY_TYPES) {
    const rawValue = rawEffect[TYPE];
    if (rawValue == null) continue;

    resolved[TYPE] = toArray(rawValue);
  }

  if (rawEffect.applyOnAction != null) {
    resolved.applyOnAction = toArray(rawEffect.applyOnAction).map(key => {
      if (key.split('-').length === 3) return key;
      return `${charId}-${key}`;
    });
  }

  resolved.applyCooldown = rawEffect.applyCooldown ?? 0;
  resolved.chance = rawEffect.chance ?? 1;

  if (rawEffect.removeOnCast) {
    resolved.removeOnCast = toArray(rawEffect.removeOnCast);
  }

  resolved.maxStacks = rawEffect.maxStacks ?? 1;
  resolved.duration = rawEffect.duration ?? Infinity;
  resolved.maxUses = rawEffect.maxUses ?? Infinity;

  resolved.followUpActionCooldown = rawEffect.followUpActionCooldown ?? 0;

  if (rawEffect.useIfType) {
    resolved.useIfType = toArray(rawEffect.useIfType);
  }

  if (rawEffect.useIfConsidered) {
    resolved.useIfConsidered = toArray(rawEffect.useIfConsidered);
  }

  if (rawEffect.useIfAction) {
    resolved.useIfAction = toArray(rawEffect.useIfAction).map(key => {
      if (key.split('-').length === 3) return key;
      return `${charId}-${key}`;
    });
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

        if (actionRaw.prefix) {
          actionDef.prefix = actionRaw.prefix;
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
