import { CHARACTER, WEAPON, MAINSTAT, SUBSTAT, GI, HSR, WW, ZZZ } from '@/data';
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

const mainstatKeys = {
  [GI]: 4,
  [HSR]: 2,
  [WW]: 4,
  [ZZZ]: 2,
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

  const existingWeaponSubstat = Object.entries(WEAPON[gameId][mCache.weaponId].stats)
    .find(([stat]) => !stat.startsWith('base'));

  const mainstatKey = mainstatKeys[gameId];

  const existingCritEquip = gameId !== WW
    ? mCache.equipList[mainstatKey]
    : mCache.equipList.find(({ mainstatId }) => mainstatId === 'critRate%')
      ?? mCache.equipList.find(({ cost }) => cost === 4);

  function testInverseCrit(weapData, mCacheOverrides) {
    const testWeaponSubstat = Object.entries(weapData.stats)
      .find(([stat]) => !stat.startsWith('base'));

    if (!existingWeaponSubstat || !testWeaponSubstat || !existingCritEquip) return;

    const mainstatKey = mainstatKeys[gameId];
    const mainstatOptions = MAINSTAT[gameId][mainstatKey];

    if ( // switch weapon from crit rate to other -> switch equip from other to crit rate
      existingWeaponSubstat[0] === 'critRate%' &&
      testWeaponSubstat[0] !== 'critRate%' &&
      existingCritEquip.mainstatId !== 'critRate%' && existingCritEquip.mainstatId in mainstatOptions
    ) {
      const otherStat = existingCritEquip.mainstatId;

      const existingOtherStatMainstatValue = otherStat.endsWith('%')
        ? existingCritEquip.mainstatValue / 10000
        : existingCritEquip.mainstatValue;
      const equivalentCritRateValue = existingOtherStatMainstatValue / mainstatOptions[otherStat].value * mainstatOptions['critRate%'].value;

      const inverseCritEquipMap = {
        ...mCache.equipMap,
        [otherStat]: mCache.equipMap[otherStat] - existingOtherStatMainstatValue,
        'critRate%': mCache.equipMap['critRate%'] + equivalentCritRateValue,
      };

      if (gameId !== WW) {
        const existingCrSub = existingCritEquip.substats.find(({ stat }) => stat === 'critRate%');

        if (existingCrSub) {
          const existingCrSubValue = existingCrSub.value / 10000;
          const existingCrSubRolls = existingCrSubValue / SUBSTAT[gameId]['critRate%'].value;
          const equivalentOtherValue = existingCrSubRolls * (SUBSTAT[gameId][otherStat]?.value ?? 0);

          inverseCritEquipMap['critRate%'] = inverseCritEquipMap['critRate%'] - existingCrSubValue;
          inverseCritEquipMap[otherStat] = inverseCritEquipMap[otherStat] + equivalentOtherValue;
        }
      }

      const inverseCritOverrides = {
        ...mCacheOverrides,
        equipMap: inverseCritEquipMap,
        statMap: toMergedObj(mCacheOverrides.baseMap, inverseCritEquipMap),
      };

      const inverseCritEquipMaps = {
        ...equipMaps,
        [charId]: inverseCritEquipMap,
      };

      return runVariantDps(cache, inverseCritEquipMaps, charId, inverseCritOverrides, durationGetter);
    }

    if ( // switch weapon from other to crit rate -> switch equip from crit rate to other
      existingWeaponSubstat[0] !== 'critRate%' &&
      testWeaponSubstat[0] === 'critRate%' &&
      existingCritEquip.mainstatId === 'critRate%'
    ) {
      const otherStat = existingWeaponSubstat[0] in mainstatOptions
        ? existingWeaponSubstat[0]
        : 'critDmg%';

      const existingCritRateMainstatValue = existingCritEquip.mainstatValue / 10000;
      const equivalentOtherStatValue = existingCritRateMainstatValue / mainstatOptions['critRate%'].value * mainstatOptions[otherStat].value;

      const inverseCritEquipMap = {
        ...mCache.equipMap,
        ['critRate%']: mCache.equipMap['critRate%'] - existingCritRateMainstatValue,
        [otherStat]: mCache.equipMap[otherStat] + equivalentOtherStatValue,
      };

      if (gameId !== WW) {
        const existingOtherSub = existingCritEquip.substats.find(({ stat }) => stat === otherStat);

        if (existingOtherSub) {
          const existingOtherSubValue = otherStat.endsWith('%')
            ? existingOtherSub.value / 10000
            : existingOtherSub.value;
          const existingOtherSubRolls = existingOtherSubValue / SUBSTAT[gameId][otherStat].value;
          const equivalentCritRateValue = existingOtherSubRolls * SUBSTAT[gameId]['critRate%'].value;

          inverseCritEquipMap[otherStat] = inverseCritEquipMap[otherStat] - existingOtherSubValue;
          inverseCritEquipMap['critRate%'] = inverseCritEquipMap['critRate%'] + equivalentCritRateValue;
        }
      }

      const inverseCritOverrides = {
        ...mCacheOverrides,
        equipMap: inverseCritEquipMap,
        statMap: toMergedObj(mCacheOverrides.baseMap, inverseCritEquipMap),
      };

      const inverseCritEquipMaps = {
        ...equipMaps,
        [charId]: inverseCritEquipMap,
      };

      return runVariantDps(cache, inverseCritEquipMaps, charId, inverseCritOverrides, durationGetter);
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
