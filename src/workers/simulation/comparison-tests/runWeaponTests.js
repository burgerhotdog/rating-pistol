import { CHARACTER, WEAPON, GI, HSR, WW, ZZZ } from '@/data';
import {
  buildBaseMap,
  getDefaultWeapRank,
  isEnabled,
  normalizeEffect,
  resolveEffectTokens,
  resolveModifyEffects,
  toMergedObj,
} from '@/utils';
import { runVariantDps } from './variantDps';

function getNormalizedWeaponEffects(rawEffects, gameId, ownerId, sourceId, weaponRank, cache) {
  const { memberIds, counts } = cache;
  const normalized = {};
  const sharedNormCtx = {
    gameId,
    ownerId,
    sourceId,
    sourceType: 'weapon',
    weaponRank,
    memberIds,
    counts: cache.counts,
  };

  const charData = CHARACTER[gameId][ownerId];
  const weapData = WEAPON[gameId][sourceId];

  if (weapData.type === charData.type) {
    for (const [index, rawEffect] of rawEffects.entries()) {
      if (!isEnabled(gameId, rawEffect, ownerId, counts, memberIds)) continue;

      const effect = normalizeEffect(gameId, rawEffect, { ...sharedNormCtx, index });
      normalized[effect.key] = effect;
    }
  }

  const tokenResolved = resolveEffectTokens(normalized);
  return resolveModifyEffects(tokenResolved);
}

function renormalizeBaseEffects(nonWeapBaseEffects, baseMap) {
  const renormalized = structuredClone(nonWeapBaseEffects);

  for (const effect of Object.values(renormalized)) {
    for (const buff of effect.buff) {
      if (buff.statRefs) {
        for (const [id, { baseAttr, multipliers, mvIndex }] of Object.entries(buff.statRefsRaw)) {
          const baseAttrValue = baseMap[baseAttr] ?? 0;

          const { mv, flat } = multipliers[0];
          const mvBuffValue = mv?.[mvIndex] ?? 0;
          const flatBuffValue = flat?.[mvIndex] ?? 0;
          buff.stats[id] = mvBuffValue * baseAttrValue + flatBuffValue;
        }
      }

      if (buff.specRefs) {
        for (const [id, fieldMap] of Object.entries(buff.specRefsRaw)) {
          for (const [field, { baseAttr, multipliers, mvIndex }] of Object.entries(fieldMap)) {
            const baseAttrValue = baseMap[baseAttr] ?? 0;

            const { mv, flat } = multipliers[0];
            const mvBuffValue = mv?.[mvIndex] ?? 0;
            const flatBuffValue = flat?.[mvIndex] ?? 0;
            buff.specs[id][field] = mvBuffValue * baseAttrValue + flatBuffValue;
          }
        }
      }
    }
  }

  return renormalized;
}

const critStatValues = {
  [GI]: {
    crMain: 0.311,
    cdMain: 0.622,
    crSub: 0.0389,
    cdSub: 0.0777,
  },
  [HSR]: {
    crMain: 0.311,
    cdMain: 0.622,
    crSub: 0.0389,
    cdSub: 0.0777,
  },
  [WW]: {
    crMain: 0.311,
    cdMain: 0.622,
    crSub: 0.0389,
    cdSub: 0.0777,
  },
  [ZZZ]: {
    crMain: 0.311,
    cdMain: 0.622,
    crSub: 0.0389,
    cdSub: 0.0777,
  },
};

export function runWeaponTests(cache, equipMaps, charId, durationGetter) {
  const { gameId } = cache;
  const { type: charType, concertoReq } = CHARACTER[gameId][charId];
  const mCache = cache.member[charId];

  const nonWeapNonBaseEffects = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) =>
        effect.sourceId !== mCache.weaponId &&
        (!effect.buff?.some((buff) => buff.statRefs || buff.specRefs))
      )
  );

  const nonWeapBaseEffects = Object.fromEntries(
    Object.entries(mCache.effects)
      .filter(([, effect]) =>
        effect.sourceId !== mCache.weaponId &&
        (effect.buff?.some((buff) => buff.statRefs || buff.specRefs))
      )
  );

  const weapDatasToTest = Object.values(WEAPON[gameId])
    .filter((weapData) => !weapData.disabled && weapData.type === charType);

  const oldStaticMapPart = Object.values(mCache.staticEffects)
    .filter((effect) => effect.sourceId !== mCache.weaponId)
    .reduce((acc, effect) => toMergedObj(acc, ...effect.buff.map(({ stats }) => stats)), {});

  const weaponResults = [];

  const existingWeaponSubstat = Object.entries(WEAPON[gameId][mCache.weaponId].stats).find(([stat]) => !stat.startsWith('base'));
  const existingCritEquip = mCache.equipList.find(({ mainstatId }) => mainstatId.startsWith('crit'));

  function testInverseCrit(weapData, mCacheOverrides) {
    const testWeaponSubstat = Object.entries(weapData.stats).find(([stat]) => !stat.startsWith('base'));

    if (
      !existingWeaponSubstat ||
      !existingCritEquip ||
      !testWeaponSubstat
    ) return;

    if (
      existingWeaponSubstat[0] === 'critRate%' &&
      testWeaponSubstat[0] === 'critDmg%'
    ) {
      if (existingCritEquip.mainstatId === 'critDmg%') {
        const inverseCritEquipMap = {
          ...mCache.equipMap,
          'critDmg%': mCache.equipMap['critDmg%'] - critStatValues[gameId].cdMain,
          'critRate%': mCache.equipMap['critRate%'] + critStatValues[gameId].crMain,
        };

        if (gameId !== WW) {
          const existingCrSub = existingCritEquip.substats.find(({ stat }) => stat === 'critRate%');

          if (existingCrSub) {
            inverseCritEquipMap['critRate%'] = inverseCritEquipMap['critRate%'] - existingCrSub.value;
            inverseCritEquipMap['critDmg%'] = inverseCritEquipMap['critDmg%'] + (existingCrSub.value * 2);
          }
        }

        const inverseCritOverrides = {
          ...mCacheOverrides,
          equipMap: inverseCritEquipMap,
        };

        const inverseCritEquipMaps = {
          ...equipMaps,
          [charId]: inverseCritEquipMap,
        };

        return runVariantDps(cache, inverseCritEquipMaps, charId, inverseCritOverrides, durationGetter);
      }
    }

    if (
      existingWeaponSubstat[0] === 'critDmg%' &&
      testWeaponSubstat[0] === 'critRate%'
    ) {
      if (existingCritEquip.mainstatId === 'critRate%') {
        const inverseCritEquipMap = {
          ...mCache.equipMap,
          'critRate%': mCache.equipMap['critRate%'] - critStatValues[gameId].crMain,
          'critDmg%': mCache.equipMap['critDmg%'] + critStatValues[gameId].cdMain,
        };

        if (gameId !== WW) {
          const existingCdSub = existingCritEquip.substats.find(({ stat }) => stat === 'critDmg%');

          if (existingCdSub) {
            inverseCritEquipMap['critDmg%'] = inverseCritEquipMap['critDmg%'] - existingCdSub.value;
            inverseCritEquipMap['critRate%'] = inverseCritEquipMap['critRate%'] + (existingCdSub.value / 2);
          }
        }

        const inverseCritOverrides = {
          ...mCacheOverrides,
          equipMap: inverseCritEquipMap,
        };

        const inverseCritEquipMaps = {
          ...equipMaps,
          [charId]: inverseCritEquipMap,
        };

        return runVariantDps(cache, inverseCritEquipMaps, charId, inverseCritOverrides, durationGetter);
      }
    }
  }

  for (const weapData of weapDatasToTest) {
    const baseMap = buildBaseMap(gameId, charId, weapData.id);

    const testRank = weapData.id === mCache.weaponId
      ? mCache.weaponRank
      : getDefaultWeapRank(gameId, weapData.id);

    const normedWeapEffs = getNormalizedWeaponEffects(weapData.effects ?? [], gameId, charId, weapData.id, testRank, cache);

    const overrideEffects = {
      ...nonWeapNonBaseEffects,
      ...renormalizeBaseEffects(nonWeapBaseEffects, baseMap),
      ...Object.fromEntries(
        Object.entries(normedWeapEffs).filter(([, effect]) => !effect.static)
      ),
    };

    const overrideStaticMap = Object.values(normedWeapEffs)
      .filter((effect) => effect.static)
      .reduce((acc, effect) => toMergedObj(acc, ...effect.buff.map(({ stats }) => stats)), {});

    const mCacheOverrides = {
      baseMap,
      statMap: toMergedObj(baseMap, mCache.equipMap),
      staticMap: toMergedObj(oldStaticMapPart, overrideStaticMap),
      effects: overrideEffects,
      ...(concertoReq && {
        concertoPenalty: Boolean(!weapData.concerto),
      }),
    };

    const inverseCritDps = testInverseCrit(weapData, mCacheOverrides);

    weaponResults.push({
      weaponId: weapData.id,
      weaponRank: testRank,
      dps: runVariantDps(cache, equipMaps, charId, mCacheOverrides, durationGetter),
      ...(inverseCritDps && { normalized: inverseCritDps }),
    });
  }

  return weaponResults;
}
