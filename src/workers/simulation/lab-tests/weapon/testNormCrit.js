import { WEAPON, MAINSTAT, SUBSTAT, GI, HSR, WW, ZZZ } from '@/data';
import { toMergedObj } from '@/utils';
import { runVariantDps } from '../variantDps';

const mainstatKeys = {
  [GI]: 4,
  [HSR]: 2,
  [WW]: 4,
  [ZZZ]: 2,
};

function testNormCrit(
  cache,
  equipMaps,
  charId,
  userWeapStat,
  userEquip,
  mainstatOptions,
  durationGetter,
  weapData,
  memberOverrides,
) {
  const { gameId, member } = cache;
  const { equipMap } = member[charId];

  const testWeapStat = Object.keys(weapData.stats)
    .find((stat) => !stat.startsWith('base'));

  if (!testWeapStat) return;

  // weapon: critRate% -> other
  // equip: other -> critRate%
  if (
    userWeapStat === 'critRate%' &&
    testWeapStat !== 'critRate%' &&
    userEquip.mainstatId !== 'critRate%'
  ) {
    const otherStat = userEquip.mainstatId;

    const otherMainValue = otherStat.endsWith('%') ? userEquip.mainstatValue / 10000 : userEquip.mainstatValue;
    const critMainValue = otherMainValue / mainstatOptions[otherStat].value * mainstatOptions['critRate%'].value;

    const normCritEquipMap = {
      ...equipMap,
      [otherStat]: equipMap[otherStat] - otherMainValue,
      'critRate%': (equipMap['critRate%'] ?? 0) + critMainValue,
    };

    if (gameId !== WW) {
      const critSub = userEquip.substats.find(({ stat }) => stat === 'critRate%');

      if (critSub) {
        const critSubValue = critSub.value / 10000;
        const otherSubValue = critSubValue / SUBSTAT[gameId]['critRate%'].value * (SUBSTAT[gameId][otherStat]?.value ?? 0);

        normCritEquipMap['critRate%'] = normCritEquipMap['critRate%'] - critSubValue;
        normCritEquipMap[otherStat] = normCritEquipMap[otherStat] + otherSubValue;
      }
    }

    const normCritOverrides = {
      ...memberOverrides,
      equipMap: normCritEquipMap,
      statMap: toMergedObj(memberOverrides.baseMap, normCritEquipMap),
    };

    const normCritEquipMaps = {
      ...equipMaps,
      [charId]: normCritEquipMap,
    };

    return runVariantDps(cache, normCritEquipMaps, charId, normCritOverrides, durationGetter);
  }

  // weapon: other -> critRate%
  // equip: critRate% -> other
  if (
    userWeapStat !== 'critRate%' &&
    testWeapStat === 'critRate%' &&
    userEquip.mainstatId === 'critRate%'
  ) {
    const otherStat = userWeapStat in mainstatOptions ? userWeapStat : 'critDmg%';

    const critMainValue = userEquip.mainstatValue / 10000;
    const otherMainValue = critMainValue / mainstatOptions['critRate%'].value * mainstatOptions[otherStat].value;

    const normCritEquipMap = {
      ...equipMap,
      ['critRate%']: equipMap['critRate%'] - critMainValue,
      [otherStat]: (equipMap[otherStat] ?? 0) + otherMainValue,
    };

    if (gameId !== WW) {
      const otherSub = userEquip.substats.find(({ stat }) => stat === otherStat);

      if (otherSub) {
        const otherSubValue = otherStat.endsWith('%') ? otherSub.value / 10000 : otherSub.value;
        const critSubValue = otherSubValue / SUBSTAT[gameId][otherStat].value * SUBSTAT[gameId]['critRate%'].value;

        normCritEquipMap[otherStat] = normCritEquipMap[otherStat] - otherSubValue;
        normCritEquipMap['critRate%'] = normCritEquipMap['critRate%'] + critSubValue;
      }
    }

    const normCritOverrides = {
      ...memberOverrides,
      equipMap: normCritEquipMap,
      statMap: toMergedObj(memberOverrides.baseMap, normCritEquipMap),
    };

    const normCritEquipMaps = {
      ...equipMaps,
      [charId]: normCritEquipMap,
    };

    return runVariantDps(cache, normCritEquipMaps, charId, normCritOverrides, durationGetter);
  }
}

export function createTestNormCrit(cache, equipMaps, charId, durationGetter) {
  const { gameId, member } = cache;
  const { weaponId, equipList } = member[charId];
  const mainstatKey = mainstatKeys[gameId];

  const userWeapData = WEAPON[gameId][weaponId];
  const userWeapStat = Object.keys(userWeapData.stats)
    .find((stat) => !stat.startsWith('base'));

  const userEquip = gameId !== WW
    ? equipList[mainstatKey]
    : equipList.find(({ mainstatId }) => mainstatId === 'critRate%')
      ?? equipList.find(({ cost }) => cost === 4);

  const mainstatOptions = MAINSTAT[gameId][mainstatKey];

  if (!userWeapStat || !userEquip) return () => null;

  return (weapData, memberOverrides) => testNormCrit(
    cache,
    equipMaps,
    charId,
    userWeapStat,
    userEquip,
    mainstatOptions,
    durationGetter,
    weapData,
    memberOverrides,
  );
}
