import { CHARACTER, SET } from '@/data';
import { appliesToCharId, isEnabledSet, isStaticBuff, toMergedObj } from '@/utils';
import { normEffect, resolveEffectTokens } from './cache/effects';
import { runVariantDps } from './variantDps';

function getNormalizedSetEffects(rawEffects, gameId, ownerId, sourceId, memberIds) {
  const normalized = {};
  const sharedNormCtx = {
    gameId,
    ownerId,
    sourceId,
    sourceType: 'set',
    memberIds,
  };

  const charData = CHARACTER[gameId][ownerId];
  for (const [index, rawEffect] of rawEffects.entries()) {
    if (!isEnabledSet(rawEffect, 5, charData)) continue;

    const normCtx = { ...sharedNormCtx, index };
    const effect = normEffect(normCtx, rawEffect);
    normalized[effect.id] = effect;
  }

  return resolveEffectTokens(normalized);
}

export function setTests(cache, equipMaps, charId) {
  const mCache = cache.member[charId];

  const nonSetEffects = Object.fromEntries(
    Object.entries(cache.effects)
      .filter(([, effect]) => !mCache.setCounts[effect.sourceId])
  );

  const setDatasToTest = Object.values(SET[cache.gameId])
    .filter((setData) => setData.bonuses.includes(5));

  const setResults = {};

  for (const setData of setDatasToTest) {
    const setEffects = getNormalizedSetEffects(setData.effects, cache.gameId, charId, setData.id, cache.memberIds);
    const effects = { ...nonSetEffects, ...setEffects };

    // Mirrors buildMenuMap: bakes charId's own always-on static buffs (now from the swapped set) into a stat map
    const staticBuffMaps = Object.values(effects)
      .filter((effect) => effect.ownerId === charId && isStaticBuff(effect) && appliesToCharId(effect, charId))
      .map((effect) => effect.buff.stats);
    const testStatMap = toMergedObj(mCache.baseMap, mCache.equipMap, ...staticBuffMaps);

    setResults[setData.id] = runVariantDps(cache, equipMaps, charId, {
      effects,
      sourceStatMap: mCache.menuMap,
      testStatMap,
    });
  }

  return setResults;
}
