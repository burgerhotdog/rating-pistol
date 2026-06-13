const toArray = (unknown) => {
  if (Array.isArray(unknown)) return unknown;
  if (unknown == null) return [];
  return [unknown];
};

const TRIGGERS = ['apply', 'use', 'remove'];
const FILTERS = ['Action', 'Type', 'Tagged', 'Cast', 'Considered'];

const DURATION_BY_CAST = {
  BA: 750,
  HA: 1000,
  MA: 1000,
  DC: 1500,
  RS: 1250,
  RL: 500,
  IS: 1000,
  OS: 0,
  CA: 0,
};

const normalizeAction = (action, entryElement = 'PHYSICAL') => {
  const normalized = {
    ...action,
    tagged: toArray(action.tagged),
    cast: toArray(action.cast),
  };

  if (!action.cast) {
    normalized.duration ??= 0;
  } else {
    normalized.duration ??= DURATION_BY_CAST[normalized.cast[0]];
  }

  normalized.type ??= 'damage';
  normalized.times ??= 1;
  normalized.offset ??= Math.round(normalized.duration * 0.75);

  if (action.multipliers) {
    normalized.multipliers = toArray(action.multipliers);
    normalized.considered = toArray(action.considered);
    normalized.attr ??= 'ATK';
    
    if (normalized.type === 'damage') {
      normalized.element ??= entryElement;
    }
  }

  return normalized;
};

const normalizeEffect = (effect, entryElement) => {
  const normalized = { ...effect };

  normalized.rank ??= 0;
  normalized.chance ??= 1;
  normalized.applyTo ??= 'self';
  normalized.applyCooldown ??= 0;
  normalized.duration ??= Infinity;
  normalized.maxUses ??= Infinity;
  normalized.maxStacks ??= 1;

  if (!normalized.applyWhen) normalized.isPassive = true;
  
  // apply, use, remove
  // Action, Type, Tagged, Cast, Considered
  for (const TRIGGER of TRIGGERS) {
    for (const FILTER of FILTERS) {
      const key = `${TRIGGER}On${FILTER}`;
      const value = effect[key];
      if (value == null) continue;

      normalized[key] = toArray(value);
    }
  }

  if (effect.followUpAction) {
    normalized.followUpAction = toArray(effect.followUpAction).map(keyOrObj => {
      if (typeof keyOrObj === 'string') return keyOrObj;
      return normalizeAction(keyOrObj, entryElement);
    });
    normalized.followUpCooldown ??= 0;
    normalized.times ??= 1;
  }

  if (effect.intervalAction) {
    normalized.intervalAction = toArray(effect.intervalAction).map(keyOrObj => {
      if (typeof keyOrObj === 'string') return keyOrObj;
      return normalizeAction(keyOrObj, entryElement);
    });
    normalized.intervalCooldown ??= 1000;
    normalized.intervalOffset ??= 0;
    normalized.times ??= 1;
  }

  return normalized;
};

const normalizeEffects = (effects, entryElement) => {
  const normalized = [];

  for (const effect of toArray(effects)) {
    normalized.push(normalizeEffect(effect, entryElement));
  }

  return normalized;
};

export const normalizeCharacters = (json) => {
  const normalized = {};

  for (const entry of json) {
    const { id, element, effects } = entry;

    normalized[id] = { ...entry, effects: normalizeEffects(effects, element) };
  }

  return normalized;
};

export const normalizeActions = (json, characters) => {
  const normalized = {};

  for (const entry of json) {
    const { id, ...skillMap } = entry;
    const normalizedEntry = {};

    for (const skillId in skillMap) {
      const skill = skillMap[skillId];
      const normalizedSkill = {};

      for (const actionId in skill) {
        const action = skill[actionId];
        const short = `${skillId}-${actionId}`;
        const key = `${id}-${short}`;

        normalizedSkill[short] = {
          ...normalizeAction(action, characters[id].element),
          short,
          key,
          skillId,
          id: actionId,
          ownerId: id,
        };
      }

      normalizedEntry[skillId] = normalizedSkill;
    }

    normalized[entry.id] = normalizedEntry;
  }

  return normalized;
};

export const normalizeWeapons = (json) => {
  const normalized = {};

  for (const entry of json) {
    const { id, effects } = entry;

    normalized[id] = { ...entry, effects: normalizeEffects(effects) };
  }

  return normalized;
};

export const normalizeSets = (json) => {
  const normalized = {};

  for (const entry of json) {
    const { id, tieredEffects = {} } = entry;
    const normalizedTieredEffects = {};

    for (const tier in tieredEffects) {
      normalizedTieredEffects[tier] = normalizeEffects(tieredEffects[tier]);
    }

    normalized[id] = { ...entry, tieredEffects: normalizedTieredEffects };
  }

  return normalized;
};
