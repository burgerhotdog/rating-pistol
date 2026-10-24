import { CHARACTER } from '@/data';
import { toArray, resolveRankedValue, normalizeAction } from '@/utils';
import { handleSpecialEffect } from './specialEffect';

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

  if (effect.special) {
    handleSpecialEffect(gameId, effect, spec);
  }

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

      if (apply.commands) {
        apply.commands = toArray(apply.commands);
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

      if (remove.commands) {
        remove.commands = toArray(remove.commands);
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
            memberIds,
            weaponRank: spec.weaponRank,
            mode: spec.memberMode,
          });
        });
      }

      if (use.commands) {
        use.commands = toArray(use.commands);
      }

      return use;
    });
  }

  if (effect.buff) {
    effect.buff = toArray(effect.buff).map((rawBuff) => normalizeBuff(gameId, rawBuff, effect, spec));
  }

  if (effect.expire) {
    const expire = effect.expire = { ...effect.expire };

    if (expire.commands) {
      expire.commands = toArray(expire.commands);
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
  }

  effect.maxStacks ??= 1;

  if (
    effect.buff?.length &&
    effect.buff.every((buff) => buff.stats && !buff.filter) &&
    !effect.apply &&
    !effect.remove &&
    !rawEffect.stores
  ) {
    effect.static = true;
  }

  return effect;
};

function normalizeBuff(gameId, rawBuff, effect, spec) {
  const buff = { ...rawBuff };

  const cooldown = buff.cooldown;
  const hasRankedCooldown = cooldown && Array.isArray(cooldown);
  if (hasRankedCooldown) {
    buff.cooldown = resolveRankedValue(cooldown, spec.weaponRank)
  }

  if (buff.replaceToken) {
    const replaceStr = buff.replaceToken === 'ownerElement'
      ? CHARACTER[gameId][effect.ownerId].element
      : '';

    if (buff.stats) {
      const resolved = {};

      for (const stat in buff.stats) {
        const value = buff.stats[stat];
        resolved[stat.replace('$', replaceStr)] = value;
      }

      buff.stats = resolved;
    }
  }

  // Resolve indexed buff stats
  if (buff.statRefs && spec.sourceType === 'character') {
    const buffStatRefsRaw = buff.statRefsRaw = {};
    const buffStats = buff.stats = {};

    for (const [id, ref] of Object.entries(buff.statRefs)) {
      const { value, ...rest } = spec.actionDefs[ref].buff;
      buffStatRefsRaw[id] = rest
      buffStats[id] = value;
    }
  }

  // Resolve indexed buff specs
  if (buff.specRefs && spec.sourceType === 'character') {
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

  if (buff.commands) {
    buff.commands = toArray(buff.commands);
  }

  // Resolve ranked values
  if (spec.sourceType === 'weapon') {
    const resolveValue = (value) => resolveRankedValue(value, spec.weaponRank);

    if (buff.stats) {
      const buffStats = buff.stats = { ...buff.stats };

      for (const [stat, valueRange] of Object.entries(buffStats)) {
        buffStats[stat] = Array.isArray(valueRange)
          ? resolveValue(valueRange)
          : valueRange;
      }
    }

    if (buff.specs) {
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
  }

  return buff;
}
