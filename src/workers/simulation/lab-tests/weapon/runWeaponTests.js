import { CHARACTER, WEAPON } from '@/data';
import {
  buildBaseMap,
  getDefaultWeapRank,
  toMergedObj,
} from '@/utils';
import { runVariantDps } from '../variantDps';
import { createTestNormCrit } from './testNormCrit';
import { getNormWeapEffs } from './normWeapEffs';
import { reNormBaseEffs } from './reNormBaseEffs';

function testWeapon(
  cache,
  equipMaps,
  charId,
  durationGetter,
  nonWeapNonBaseEffs,
  nonWeapBaseEffs,
  nonWeapStaticMap,
  testNormCrit,
  weapData,
) {
  const { gameId, member } = cache;
  const { weaponId: userWeapId, weaponRank: userWeapRank, equipMap: userEquipMap } = member[charId];
  const { type: charType, concertoReq } = CHARACTER[gameId][charId];
  const { id: testWeapId, type: weapType } = weapData;
 
  const baseMap = buildBaseMap(gameId, charId, testWeapId);

  const testWeapRank = testWeapId === userWeapId
    ? userWeapRank
    : getDefaultWeapRank(gameId, testWeapId);

  const normWeapEffs = charType === weapType
    ? getNormWeapEffs(cache, charId, weapData, testWeapRank)
    : {};

  const overrideEffects = {
    ...nonWeapNonBaseEffs,
    ...reNormBaseEffs(nonWeapBaseEffs, baseMap),
    ...Object.fromEntries(
      Object.entries(normWeapEffs)
        .filter(([, effect]) => !effect.static)
    ),
  };

  const weapStaticMap = Object.values(normWeapEffs)
    .filter((effect) => effect.static)
    .reduce((acc, effect) => toMergedObj(acc, ...effect.buff.map(({ stats }) => stats)), {});

  const memberOverrides = {
    baseMap,
    statMap: toMergedObj(baseMap, userEquipMap),
    staticMap: toMergedObj(nonWeapStaticMap, weapStaticMap),
    effects: overrideEffects,
    ...(concertoReq && {
      concertoPenalty: Boolean(!weapData.concerto),
    }),
  };

  const normCritDps = testNormCrit(weapData, memberOverrides);

  return {
    weaponId: testWeapId,
    weaponRank: testWeapRank,
    dps: runVariantDps(cache, equipMaps, charId, memberOverrides, durationGetter),
    ...(normCritDps && { normalized: normCritDps }),
  };
}

export function runWeaponTests(cache, equipMaps, charId, durationGetter) {
  const { gameId } = cache;
  const { type: charType } = CHARACTER[gameId][charId];
  const mCache = cache.member[charId];

  const nonWeapNonBaseEffs = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) =>
        effect.sourceId !== mCache.weaponId &&
        (!effect.buff?.some((buff) => buff.statRefs || buff.specRefs))
      )
  );

  const nonWeapBaseEffs = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) =>
        effect.sourceId !== mCache.weaponId &&
        (effect.buff?.some((buff) => buff.statRefs || buff.specRefs))
      )
  );

  const nonWeapStaticMap = Object.values(mCache.staticEffects)
    .filter((effect) => effect.sourceId !== mCache.weaponId)
    .reduce((acc, effect) => toMergedObj(acc, ...effect.buff.map(({ stats }) => stats)), {});

  const testNormCrit = createTestNormCrit(cache, equipMaps, charId, durationGetter);

  const results = [];

  for (const weapData of Object.values(WEAPON[gameId])) {
    if (weapData.disabled || weapData.type !== charType) continue;

    const result = testWeapon(
      cache,
      equipMaps,
      charId,
      durationGetter,
      nonWeapNonBaseEffs,
      nonWeapBaseEffs,
      nonWeapStaticMap,
      testNormCrit,
      weapData,
    );

    results.push(result);
  }

  return results;
}
