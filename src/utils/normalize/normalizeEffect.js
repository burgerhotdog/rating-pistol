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
  const {
    ownerId, sourceId, index,
    memberIds,
  } = spec;

  const effect = {
    ...rawEffect,
    ownerId, sourceId, index,
    category: `${sourceId}:effect${index}`,
    key: `${ownerId}.${sourceId}:effect${index}`,
  };

  // Scope
  effect.stores = normalizeScope(rawEffect.stores, { ownerId, memberIds });

  if (effect.apply) {
    effect.apply = toArray(effect.apply).map((rawApply) => {
      const apply = { ...rawApply };

      apply.by = normalizeScope(apply.by, { ownerId, memberIds });

      if (spec.sourceType !== 'character') {
        apply.field ??= 'onField';
      }
      if (apply.field === '*') {
        apply.field = null;
      }

      const cooldown = apply.cooldown;
      const hasRankedCooldown = cooldown && Array.isArray(cooldown);
      if (hasRankedCooldown) {
        apply.cooldown = resolveRankedValue(cooldown, spec.weaponRank)
      }

      return apply;
    });
  }

  if (effect.remove) {
    effect.remove = toArray(effect.remove).map((rawRemove) => {
      const remove = { ...rawRemove };

      remove.by = normalizeScope(remove.by, { ownerId, memberIds });

      const cooldown = remove.cooldown;
      const hasRankedCooldown = cooldown && Array.isArray(cooldown);
      if (hasRankedCooldown) {
        remove.cooldown = resolveRankedValue(cooldown, spec.weaponRank)
      }

      return remove;
    });
  }

  if (effect.use) {
    effect.use = toArray(effect.use).map((rawUse) => {
      const use = { ...rawUse };

      use.by = normalizeScope(use.by, { ownerId, memberIds });

      const cooldown = use.cooldown;
      const hasRankedCooldown = cooldown && Array.isArray(cooldown);
      if (hasRankedCooldown) {
        use.cooldown = resolveRankedValue(cooldown, spec.weaponRank)
      }

      if (use.action) {
        use.action = toArray(use.action).map((rawAction, i) => {
          if (typeof rawAction === 'string') {
            return spec.actionDefs[rawAction];
          }

          return normalizeAction(gameId, rawAction, {
            ownerId,
            category: effect.category,
            index: i,
            teamSize: memberIds.length,
            weaponRank: spec.weaponRank,
            mode: spec.memberMode,
          });
        });
      }

      return use;
    });
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

    if (effect.buff?.cooldown && Array.isArray(effect.buff.cooldown)) {
      const buff = effect.buff = { ...effect.buff };
      buff.cooldown = resolveValue(buff.cooldown);
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
