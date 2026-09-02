import { CHARACTER, WEAPON } from '@/data';
import { buildBaseMap, isEnabledWeap, toMergedObj } from '@/utils';
import { normEffect, resolveEffectTokens } from './cache/effects';
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

  const charData = CHARACTER[gameId][ownerId];
  const weapData = WEAPON[gameId][sourceId];
  for (const [index, rawEffect] of rawEffects.entries()) {
    if (!isEnabledWeap(rawEffect, charData, weapData)) continue;

    const normCtx = { ...sharedNormCtx, index };
    const effect = normEffect(normCtx, rawEffect);
    normalized[effect.id] = effect;
  }

  return resolveEffectTokens(normalized);
}

export function weaponTests(cache, equipMaps, charId) {
  const mCache = cache.member[charId];
  const charData = CHARACTER[cache.gameId][charId];
  const weapDatas = WEAPON[cache.gameId];

  const nonWeapEffects = Object.fromEntries(
    Object.entries(cache.effects)
      .filter(([, effect]) => !(effect.ownerId === charId && effect.sourceId === mCache.weaponId))
  );

  const weapDatasToTest = Object.values(weapDatas)
    .filter((weapData) => weapData.type === charData.type);

  const weaponResults = {};

  for (const weapData of weapDatasToTest) {
    const baseMap = buildBaseMap(cache.gameId, charId, weapData.id);
    const statMap = toMergedObj(baseMap, mCache.equipMap);

    const concertoPenalty = charData.concertoReq && !weapDatas[weapData.id]?.concerto;
    const memberOverride = { baseMap, statMap, concertoPenalty };

    weaponResults[weapData.id] = [1, 5].map((weaponRank) => {
      const weaponEffects = getNormalizedWeaponEffects(weapData.effects, cache.gameId, charId, weapData.id, weaponRank, cache.memberIds);
      const effects = { ...nonWeapEffects, ...weaponEffects };

      return runVariantDps(cache, equipMaps, charId, { effects, memberOverride });
    });
  }

  return weaponResults;
}
