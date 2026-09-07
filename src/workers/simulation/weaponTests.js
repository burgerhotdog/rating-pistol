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
    normalized[effect.id] = effect;
  }

  return resolveEffectTokens(normalized);
}

export function weaponTests(cache, equipMaps, charId) {
  const { gameId } = cache;
  const { type: charType, concertoReq } = CHARACTER[gameId][charId];
  const mCache = cache.member[charId];

  const nonWeapEffects = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) => effect.sourceId !== mCache.weaponId)
  );

  const weapDatasToTest = Object.values(WEAPON[gameId])
    .filter((weapData) => weapData.type === charType);

  const weaponResults = [];

  for (const weapData of weapDatasToTest) {
    const baseMap = buildBaseMap(gameId, charId, weapData.id);

    const testRank = weapData.id === mCache.weaponId
      ? mCache.weaponRank
      : getDefaultWeapRank(gameId, weapData.id);

    const mCacheOverrides = {
      baseMap,
      statMap: toMergedObj(baseMap, mCache.equipMap),
      effects: {
        ...nonWeapEffects,
        ...getNormalizedWeaponEffects(weapData.effects, gameId, charId, weapData.id, testRank, cache.memberIds),
      },
      ...(concertoReq && { concertoPenalty: Boolean(weapData.concerto) }),
    };

    weaponResults.push({
      weaponId: weapData.id,
      weaponRank: testRank,
      dps: runVariantDps(cache, equipMaps, charId, mCacheOverrides),
    });
  }

  return weaponResults;
}
