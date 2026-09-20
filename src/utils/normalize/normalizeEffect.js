import { toArray, resolveRankedValue, normalizeAction } from '@/utils';

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
    key: `${ownerId}.${sourceId}:effect${index}`,
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

    if (spec.sourceType === 'weapon' || spec.sourceType === 'set') {
      apply.field ??= 'onField';
    }

    if (apply.field === '*') {
      apply.field = null;
    }
  }

  // Resolve indexed buff stats
  if (effect.buff?.statRefs && spec.sourceType === 'character') {
    const buff = effect.buff = { ...effect.buff };
    const buffStatRefsRaw = buff.statRefsRaw = {};
    const buffStats = buff.stats = {};

    for (const [id, ref] of Object.entries(buff.statRefs)) {
      const { value, ...rest } = spec.actionDefs[ref].buff;
      buffStatRefsRaw[id] = rest
      buffStats[id] = value;
    }
  }

  // Resolve indexed buff specs
  if (effect.buff?.specRefs && spec.sourceType === 'character') {
    const buff = effect.buff = { ...effect.buff };
    const buffSpecRefsRaw = buff.specRefsRaw = {};
    const buffSpecs = buff.specs = {};

    for (const [id, specRef] of Object.entries(buff.specRefs)) {
      const buffSpec = buffSpecs[id] = { ...specRef };
      buffSpecRefsRaw[id] = {};

      for (const [field, ref] of Object.entries(buffSpec)) {
        if (field === 'attr' || typeof ref === 'number') continue;
        const { value, ...rest } = spec.actionDefs[ref].buff;
        buffSpecRefsRaw[id][field] = rest;
        buffSpec[field] = value;
      }
    }
  }

  // Resolve ranked values
  if (spec.sourceType === 'weapon') {
    const resolveValue = (value) => resolveRankedValue(value, spec.weaponRank);

    if (effect.modify?.spec?.buff?.stats) {
      effect.modify = structuredClone(effect.modify);
      const buffStats = effect.modify.spec.buff.stats;
      for (const [stat, valueRange] of Object.entries(buffStats)) {
        buffStats[stat] = Array.isArray(valueRange)
          ? resolveValue(valueRange)
          : valueRange;
      }
    }

    if (effect.buff?.stats) {
      const buff = effect.buff = { ...effect.buff };
      const buffStats = buff.stats = { ...buff.stats };

      for (const [stat, valueRange] of Object.entries(buffStats)) {
        buffStats[stat] = Array.isArray(valueRange)
          ? resolveValue(valueRange)
          : valueRange;
      }
    }

    if (effect.buff?.specs) {
      const buff = effect.buff = { ...effect.buff };
      const buffSpecs = buff.specs = { ...buff.specs };

      for (const [id, rankedSpec] of Object.entries(buffSpecs)) {
        const buffSpec = buffSpecs[id] = { ...rankedSpec };

        for (const [field, valueRange] of Object.entries(buffSpec)) {
          buffSpec[field] = Array.isArray(valueRange)
            ? resolveValue(valueRange)
            : valueRange;
        }
      }
    }

    if (effect.apply?.cooldown && Array.isArray(effect.apply.cooldown)) {
      const apply = effect.apply = { ...effect.apply };
      apply.cooldown = resolveValue(apply.cooldown);
    }

    if (effect.remove?.cooldown && Array.isArray(effect.remove.cooldown)) {
      const remove = effect.remove = { ...effect.remove };
      remove.cooldown = resolveValue(remove.cooldown);
    }

    if (effect.use?.cooldown && Array.isArray(effect.use.cooldown)) {
      const use = effect.use = { ...effect.use };
      use.cooldown = resolveValue(use.cooldown);
    }

    if (effect.buff?.cooldown && Array.isArray(effect.buff.cooldown)) {
      const buff = effect.buff = { ...effect.buff };
      buff.cooldown = resolveValue(buff.cooldown);
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

  if (
    effect.buff?.stats &&
    !effect.buff?.filter &&
    !effect.apply &&
    !effect.remove &&
    !rawEffect.stores
  ) {
    effect.static = true;
  }

  return effect;
};
