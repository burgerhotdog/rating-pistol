import { WEAPON, MAINSTAT, SUBSTAT, GI, HSR, WW, ZZZ } from '@/data';
import { toMergedObj } from '@/utils';
import { runVariantDps } from '../variantDps';

const mainstatKeys = {
  [GI]: 4,
  [HSR]: 2,
  [WW]: 4,
  [ZZZ]: 2,
};

function testInvertedCrit(
  cache,
  equipMaps,
  charId,
  existingWeaponSubstat,
  mainstatOptions,
  existingCritEquip,
  durationGetter,
  weapData,
  mCacheOverrides,
) {
  const {
    gameId,
    member: {
      [charId]: {
        equipMap,
      },
    },
  } = cache;

  const testWeaponSubstat = Object.entries(weapData.stats)
    .find(([stat]) => !stat.startsWith('base'));

  if (!existingWeaponSubstat || !testWeaponSubstat || !existingCritEquip) return;

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
      ...equipMap,
      [otherStat]: equipMap[otherStat] - existingOtherStatMainstatValue,
      'critRate%': equipMap['critRate%'] + equivalentCritRateValue,
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
      ...equipMap,
      ['critRate%']: equipMap['critRate%'] - existingCritRateMainstatValue,
      [otherStat]: equipMap[otherStat] + equivalentOtherStatValue,
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

export function createTestInvertedCrit(cache, equipMaps, charId, durationGetter) {
  const {
    gameId,
    member: {
      [charId]: { weaponId, equipList },
    },
  } = cache;

  const existingWeaponSubstat = Object.entries(WEAPON[gameId][weaponId].stats)
    .find(([stat]) => !stat.startsWith('base'));

  const mainstatKey = mainstatKeys[gameId];
  const mainstatOptions = MAINSTAT[gameId][mainstatKey];

  const existingCritEquip = gameId !== WW
    ? equipList[mainstatKey]
    : equipList.find(({ mainstatId }) => mainstatId === 'critRate%')
      ?? equipList.find(({ cost }) => cost === 4);

  return (weapData, mCacheOverrides) => testInvertedCrit(
    cache,
    equipMaps,
    charId,
    existingWeaponSubstat,
    mainstatOptions,
    existingCritEquip,
    durationGetter,
    weapData,
    mCacheOverrides,
  );
}
