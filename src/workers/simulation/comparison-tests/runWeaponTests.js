import { CHARACTER, WEAPON } from '@/data';
import {
  buildBaseMap,
  getDefaultWeapRank,
  isEnabledWeap,
  normalizeEffect,
  resolveEffectTokens,
  toMergedObj,
} from '@/utils';
import { runVariantDps } from './variantDps';

function getNormalizedWeaponEffects(rawEffects, gameId, ownerId, sourceId, weaponRank, memberIds) {
  const normalized = {};
  const sharedNormCtx = {
    gameId,
    ownerId,
    sourceId,
    sourceType: 'weapon',
    weaponRank,
    memberIds,
  };

  for (const [index, rawEffect] of rawEffects.entries()) {
    if (!isEnabledWeap(rawEffect, CHARACTER[gameId][ownerId], WEAPON[gameId][sourceId])) continue;

    const effect = normalizeEffect(gameId, rawEffect, { ...sharedNormCtx, index });
    normalized[effect.key] = effect;
  }

  return resolveEffectTokens(normalized);
}

function renormalizeBaseEffects(nonWeapBaseEffects, baseMap) {
  const renormalized = structuredClone(nonWeapBaseEffects);

  for (const effect of Object.values(renormalized)) {
    if (effect.buff.statRefs) {
      for (const [id, { baseAttr, multipliers, mvIndex }] of Object.entries(effect.buff.statRefsRaw)) {
        const baseAttrValue = baseMap[baseAttr] ?? 0;

        const { mv, flat } = multipliers[0];
        const mvBuffValue = mv?.[mvIndex] ?? 0;
        const flatBuffValue = flat?.[mvIndex] ?? 0;
        effect.buff.stats[id] = mvBuffValue * baseAttrValue + flatBuffValue;
      }
    }

    if (effect.buff.specRefs) {
      for (const [id, fieldMap] of Object.entries(effect.buff.specRefsRaw)) {
        for (const [field, { baseAttr, multipliers, mvIndex }] of Object.entries(fieldMap)) {
          const baseAttrValue = baseMap[baseAttr] ?? 0;

          const { mv, flat } = multipliers[0];
          const mvBuffValue = mv?.[mvIndex] ?? 0;
          const flatBuffValue = flat?.[mvIndex] ?? 0;
          effect.buff.specs[id][field] = mvBuffValue * baseAttrValue + flatBuffValue;
        }
      }
    }
  }

  return renormalized;
}

export function runWeaponTests(cache, equipMaps, charId) {
  const { gameId } = cache;
  const { type: charType, concertoReq } = CHARACTER[gameId][charId];
  const mCache = cache.member[charId];

  const nonWeapNonBaseEffects = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) =>
        effect.sourceId !== mCache.weaponId &&
        (!effect.buff?.statRefs && !effect.buff?.specRefs)
      )
  );

  const nonWeapBaseEffects = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) =>
        effect.sourceId !== mCache.weaponId &&
        (effect.buff?.statRefs || effect.buff?.specRefs)
      )
  );

  const weapDatasToTest = Object.values(WEAPON[gameId]).filter((weapData) =>
    !weapData.disabled && weapData.type === charType
  );

  const weaponResults = [];

  for (const weapData of weapDatasToTest) {
    const baseMap = buildBaseMap(gameId, charId, weapData.id);

    const testRank = weapData.id === mCache.weaponId
      ? mCache.weaponRank
      : getDefaultWeapRank(gameId, weapData.id);

    const overrideEffects = {
      ...nonWeapNonBaseEffects,
      ...renormalizeBaseEffects(nonWeapBaseEffects, baseMap),
      ...getNormalizedWeaponEffects(weapData.effects, gameId, charId, weapData.id, testRank, cache.memberIds),
    };

    const overrideStaticMap = Object.values(overrideEffects)
      .filter((effect) => effect.static)
      .reduce((acc, effect) => toMergedObj(acc, effect.buff.stats), {});

    const mCacheOverrides = {
      baseMap,
      statMap: toMergedObj(baseMap, mCache.equipMap),
      staticMap: overrideStaticMap,
      effects: overrideEffects,
      ...(concertoReq && { concertoPenalty: Boolean(!weapData.concerto) }),
    };

    weaponResults.push({
      weaponId: weapData.id,
      weaponRank: testRank,
      dps: runVariantDps(cache, equipMaps, charId, mCacheOverrides),
    });
  }

  return weaponResults;
}
