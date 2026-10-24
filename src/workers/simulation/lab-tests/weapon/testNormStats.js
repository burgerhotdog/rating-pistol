import { WEAPON, MISC, MAINSTAT, SUBSTAT, GI, HSR, WW, ZZZ } from '@/data';
import { toMergedObj } from '@/utils';
import { runVariantDps } from '../variantDps';

const critMainstatKeys = {
  [GI]: 4,
  [HSR]: 2,
  [WW]: 4,
  [ZZZ]: 2,
};

const energyMainstatKeys = {
  [GI]: 2,
  [HSR]: 5,
  [WW]: 3,
  [ZZZ]: 5,
};

function testNormStats(
  cache,
  equipMaps,
  charId,
  userWeapStat,
  userCritEquip,
  userEnergyEquip,
  critMainstatOptions,
  energyMainstatOptions,
  energyOtherStat,
  durationGetter,
  weapData,
  memberOverrides,
) {
  const { gameId, member } = cache;
  const { equipMap } = member[charId];
  const { energyAttr } = MISC[gameId];

  const testWeapStat = Object.keys(weapData.stats)
    .find((stat) => !stat.startsWith('base'));

  if (!testWeapStat) return;

  let wasChanged = false;
  const normEquipMap = { ...equipMap };

  // weapon: crit rate -> other
  // equip: other -> crit rate
  if (
    userWeapStat === 'critRate%' &&
    testWeapStat !== 'critRate%' &&
    userCritEquip?.mainstatId !== 'critRate%'
  ) {
    wasChanged = true;
    const otherStat = userCritEquip.mainstatId;

    const otherMainValue = otherStat.endsWith('%') ? userCritEquip.mainstatValue / 10000 : userCritEquip.mainstatValue;
    const critMainValue = otherMainValue / critMainstatOptions[otherStat].value * critMainstatOptions['critRate%'].value;

    normEquipMap[otherStat] = equipMap[otherStat] - otherMainValue;
    normEquipMap['critRate%'] = (equipMap['critRate%'] ?? 0) + critMainValue;

    if (gameId !== WW) {
      const critSub = userCritEquip.substats.find(({ stat }) => stat === 'critRate%');

      if (critSub) {
        const critSubValue = critSub.value / 10000;
        const otherSubValue = critSubValue / SUBSTAT[gameId]['critRate%'].value * (SUBSTAT[gameId][otherStat]?.value ?? 0);

        normEquipMap['critRate%'] = normEquipMap['critRate%'] - critSubValue;
        normEquipMap[otherStat] = normEquipMap[otherStat] + otherSubValue;
      }
    }
  }

  // weapon: other -> crit rate
  // equip: crit rate -> other
  if (
    userWeapStat !== 'critRate%' &&
    testWeapStat === 'critRate%' &&
    userCritEquip?.mainstatId === 'critRate%'
  ) {
    wasChanged = true;
    const otherStat = userWeapStat in critMainstatOptions ? userWeapStat : 'critDmg%';

    const critMainValue = userCritEquip.mainstatValue / 10000;
    const otherMainValue = critMainValue / critMainstatOptions['critRate%'].value * critMainstatOptions[otherStat].value;

    normEquipMap['critRate%'] = equipMap['critRate%'] - critMainValue;
    normEquipMap[otherStat] = (equipMap[otherStat] ?? 0) + otherMainValue;

    if (gameId !== WW) {
      const otherSub = userCritEquip.substats.find(({ stat }) => stat === otherStat);

      if (otherSub) {
        const otherSubValue = otherStat.endsWith('%') ? otherSub.value / 10000 : otherSub.value;
        const critSubValue = otherSubValue / SUBSTAT[gameId][otherStat].value * SUBSTAT[gameId]['critRate%'].value;

        normEquipMap[otherStat] = normEquipMap[otherStat] - otherSubValue;
        normEquipMap['critRate%'] = normEquipMap['critRate%'] + critSubValue;
      }
    }
  }

  // weapon: energy -> other
  // equip: other -> energy
  if (
    userWeapStat === energyAttr &&
    testWeapStat !== energyAttr &&
    userEnergyEquip?.mainstatId !== energyAttr
  ) {
    wasChanged = true;
    const otherStat = userEnergyEquip.mainstatId;

    const otherMainValue = otherStat.endsWith('%') ? userEnergyEquip.mainstatValue / 10000 : userEnergyEquip.mainstatValue;
    const energyMainValue = otherMainValue / energyMainstatOptions[otherStat].value * energyMainstatOptions[energyAttr].value;

    normEquipMap[otherStat] = equipMap[otherStat] - otherMainValue;
    normEquipMap[energyAttr] = (equipMap[energyAttr] ?? 0) + energyMainValue;

    if (gameId !== WW) {
      const energySub = userEnergyEquip.substats.find(({ stat }) => stat === energyAttr);

      if (energySub) {
        const energySubValue = energySub.value / 10000;
        const otherSubValue = energySubValue / SUBSTAT[gameId][energyAttr].value * (SUBSTAT[gameId][otherStat]?.value ?? 0);

        normEquipMap[energyAttr] = normEquipMap[energyAttr] - energySubValue;
        normEquipMap[otherStat] = normEquipMap[otherStat] + otherSubValue;
      }
    }
  }

  // weapon: other -> energy
  // equip: energy -> other
  if (
    userWeapStat !== energyAttr &&
    testWeapStat === energyAttr &&
    userEnergyEquip?.mainstatId === energyAttr
  ) {
    wasChanged = true;
    const otherStat = energyOtherStat;

    const energyMainValue = userEnergyEquip.mainstatValue / 10000;
    const otherMainValue = energyMainValue / energyMainstatOptions[energyAttr].value * energyMainstatOptions[otherStat].value;

    normEquipMap[energyAttr] = equipMap[energyAttr] - energyMainValue;
    normEquipMap[otherStat] = (equipMap[otherStat] ?? 0) + otherMainValue;

    if (gameId !== WW) {
      const otherSub = userEnergyEquip.substats.find(({ stat }) => stat === otherStat);

      if (otherSub) {
        const otherSubValue = otherStat.endsWith('%') ? otherSub.value / 10000 : otherSub.value;
        const energySubValue = otherSubValue / SUBSTAT[gameId][otherStat].value * SUBSTAT[gameId][energyAttr].value;

        normEquipMap[otherStat] = normEquipMap[otherStat] - otherSubValue;
        normEquipMap[energyAttr] = normEquipMap[energyAttr] + energySubValue;
      }
    }
  }

  if (!wasChanged) return;

  const normOverrides = {
    ...memberOverrides,
    equipMap: normEquipMap,
    statMap: toMergedObj(memberOverrides.baseMap, normEquipMap),
  };

  const normEquipMaps = {
    ...equipMaps,
    [charId]: normEquipMap,
  };

  return runVariantDps(cache, normEquipMaps, charId, normOverrides, durationGetter);
}

export function createTestNormStats(cache, equipMaps, charId, durationGetter) {
  const { gameId, member } = cache;
  const { weaponId, equipList } = member[charId];
  const { energyAttr } = MISC[gameId];

  const userWeapData = WEAPON[gameId][weaponId];
  const userWeapStat = Object.keys(userWeapData.stats)
    .find((stat) => !stat.startsWith('base'));

  const critMainstatKey = critMainstatKeys[gameId];
  const energyMainstatKey = energyMainstatKeys[gameId];

  const userCritEquip = gameId !== WW
    ? equipList[critMainstatKey]
    : equipList.find(({ mainstatId }) => mainstatId === 'critRate%')
      ?? equipList.find(({ cost }) => cost === 4);

  const userEnergyEquip = gameId !== WW
    ? equipList[energyMainstatKey]
    : equipList.find(({ mainstatId }) => mainstatId === energyAttr)
      ?? equipList.find(({ cost }) => cost === 3);

  const critMainstatOptions = MAINSTAT[gameId][critMainstatKey];
  const energyMainstatOptions = MAINSTAT[gameId][energyMainstatKey];

  if (!userWeapStat) return () => null;

  const energyOtherCandidates = userWeapStat in energyMainstatOptions
    ? [userWeapStat]
    : Object.keys(energyMainstatOptions).filter((stat) => stat !== energyAttr);

  const run = (energyOtherStat, weapData, memberOverrides) => testNormStats(
    cache,
    equipMaps,
    charId,
    userWeapStat,
    userCritEquip,
    userEnergyEquip,
    critMainstatOptions,
    energyMainstatOptions,
    energyOtherStat,
    durationGetter,
    weapData,
    memberOverrides,
  );

  return (weapData, memberOverrides) => {
    const testWeapStat = Object.keys(weapData.stats)
      .find((stat) => !stat.startsWith('base'));

    const energyOtherApplies = testWeapStat === energyAttr
      && userWeapStat !== energyAttr
      && userEnergyEquip?.mainstatId === energyAttr;

    // Only fan out when the other -> energy case is actually in play,
    // otherwise the candidates would just repeat identical work.
    if (!energyOtherApplies || energyOtherCandidates.length === 1) {
      return run(energyOtherCandidates[0], weapData, memberOverrides);
    }

    let best = -Infinity;

    energyOtherCandidates.forEach((stat) => {
      const dps = run(stat, weapData, memberOverrides);

      if (dps > best) {
        best = dps;
      }
    });

    return best;
  };
}
