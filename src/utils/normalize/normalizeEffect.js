import { toArray, resolveRankedValue, normalizeAction } from '@/utils';

function mergeValues(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return [a, b];
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return [
      ...toArray(a),
      ...toArray(b),
    ];
  }

  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const merged = { ...a };

    for (const [key, value] of Object.entries(b)) {
      merged[key] = key in merged
        ? mergeValues(merged[key], value)
        : value;
    }

    return merged;
  }

  return b;
}

function resolveRankMods(effect, memberRank) {
  const { rankMods } = effect;

  for (const { rank, ...modSpec } of rankMods) {
    if (rank > memberRank) continue;

    for (const [field, add] of Object.entries(modSpec)) {
      effect[field] = field in effect
        ? mergeValues(effect[field], add)
        : add;
    }
  }
}

function normalizeScope(rawScope, { ownerId, memberIds }) {
  switch (rawScope) {
    case undefined: {
      return [ownerId];
    }

    case '$team': {
      return memberIds;
    }

    case '$ally': {
      return memberIds.filter((id) => id !== ownerId);
    }

    case '$first': {
      return [memberIds[0]];
    }

    case '$next': {
      return [memberIds.at(memberIds.indexOf(ownerId) - 1)];
    }

    default: {
      return toArray(rawScope);
    }
  }
}

export const normalizeEffect = (gameId, rawEffect, spec) => {
  const { ownerId, sourceId, index } = spec;

  const effect = {
    ...rawEffect,
    ownerId, sourceId, index,
    category: `${sourceId}:effect${index}`,
    id: `${ownerId}.${sourceId}:effect${index}`,
  };

  // Scope
  effect.stores = normalizeScope(rawEffect.stores, {
    ownerId, 
    memberIds: spec.memberIds,
  });

  if (effect.apply) {
    const apply = effect.apply = { ...effect.apply };

    apply.by = normalizeScope(apply.by, {
      ownerId,
      memberIds: spec.memberIds,
    });
  }

  // Resolve ranked buff stats/specs
  if (effect.buff && spec.sourceType === 'weapon') {
    const buff = effect.buff = { ...effect.buff };

    if (buff.stats) {
      const buffStats = buff.stats = { ...buff.stats };

      for (const [id, valueRange] of Object.entries(buffStats)) {
        if (!Array.isArray(valueRange)) continue;
        buffStats[id] = resolveRankedValue(valueRange, spec.weaponRank);
      }
    }

    if (buff.specs) {
      const buffSpecs = buff.specs = { ...buff.specs };

      for (const [id, rankedSpec] of Object.entries(buffSpecs)) {
        const buffSpec = buffSpecs[id] = { ...rankedSpec };

        for (const [field, valueRange] of Object.entries(buffSpec)) {
          if (!Array.isArray(valueRange)) continue;
          buffSpec[field] = resolveRankedValue(valueRange, spec.weaponRank);
        }
      }
    }
  }

  if (effect.use) {
    const use = effect.use = { ...effect.use };

    if (use.action) {
      const useActions = use.action = toArray(use.action);

      for (const [i, rawUseAction] of useActions.entries()) {
        if (typeof rawUseAction === 'string') {
          useActions[i] = spec.actionDefs[rawUseAction];
          continue;
        }

        useActions[i] = normalizeAction(gameId, rawUseAction, {
          ownerId,
          category: effect.category,
          index: i,
          teamSize: spec.memberIds.length,
          weaponRank: spec.weaponRank,
          mode: spec.memberMode,
        });
      }
    }
  }

  if (effect.rankMods) {
    resolveRankMods(effect, spec.memberRank);
  }

  return effect;
};
