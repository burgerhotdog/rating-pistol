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

const normalizeAction = (action, element = 'PHYSICAL') => {
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
  if (!action.cast) resolved.duration ??= 0;
  resolved.duration ??= DURATION_BY_CAST[resolved.cast[0]];
  resolved.offset ??= resolved.duration * 0.75;

  if (resolved.type === 'damage') resolved.element ??= element;

  return resolved;
};

const normalizeEffect = (effect, source) => {
  const resolved = { ...effect };

  resolved.rank ??= 0;
  resolved.chance ??= 1;
  resolved.applyTo ??= 'self';
  resolved.applyCooldown ??= 0;
  resolved.duration ??= Infinity;
  resolved.maxUses ??= Infinity;
  resolved.maxStacks ??= 1;

  if (!resolved.applyWhen) resolved.isPassive = true;
  
  // apply, use, remove
  // Action, Type, Tagged, Cast, Considered
  for (const TRIGGER of TRIGGERS) {
    for (const FILTER of FILTERS) {
      const key = `${TRIGGER}On${FILTER}`;
      const value = effect[key];
      if (value == null) continue;

      resolved[key] = toArray(value);
    }
  }

  resolved.useIfStatus &&= toArray(effect.useIfStatus);

  if (effect.followUpAction) {
    resolved.followUpAction = toArray(effect.followUpAction).map(keyOrObj => {
      if (typeof keyOrObj === 'string') return keyOrObj;
      return normalizeAction(keyOrObj, source.element);
    });
    resolved.followUpCooldown ??= 0;
    resolved.times ??= 1;
  }

  if (effect.intervalAction) {
    resolved.intervalAction = toArray(effect.intervalAction).map(keyOrObj => {
      if (typeof keyOrObj === 'string') return keyOrObj;
      return normalizeAction(keyOrObj, source.element);
    });
    resolved.intervalCooldown ??= 1000;
    resolved.intervalOffset ??= 0;
    resolved.times ??= 1;
  }

  return resolved;
};

export const normalizeCharacters = (json) => {
  const resolved = {};

  for (const character of json) {
    resolved[character.id] = {
      ...character,
      effects: toArray(character.effects).map(effect =>
        normalizeEffect(effect, character)
      ),
    };
  }

  return resolved;
};

export const normalizeActions = (json, characters) => {
  const resolved = {};

  for (const character of json) {
    const { id, ...skillTree } = character;
    const { element } = characters[id];
    const resolvedCharacter = {};

    for (const skillId in skillTree) {
      for (const actionId in skillTree[skillId]) {
        const key = `${skillId}-${actionId}`;
        resolvedCharacter[key] = {
          ...normalizeAction(skillTree[skillId][actionId], element),
          key,
          owner: id,
          skill: skillId,
          id: actionId,
        };
      }
    }

    resolved[id] = resolvedCharacter;
  }

  return resolved;
};

export const normalizeWeapons = (json) => {
  const resolved = {};

  for (const weapon of json) {
    const effects = [];
    for (const effect of toArray(weapon.effects)) {
      effects.push(normalizeEffect(effect, weapon));
    }

    resolved[weapon.id] = { ...weapon, effects };
  }

  return resolved;
};

export const normalizeSets = (json) => {
  const resolved = {};

  for (const set of json) {
    const setBonus = {};

    for (const tier in set.setBonus) {
      const effects = [];
      for (const effect of toArray(set.setBonus[tier])) {
        effects.push(normalizeEffect(effect, set));
      }

      setBonus[tier] = effects;
    }

    resolved[set.id] = { ...set, setBonus };
  }

  return resolved;
};
