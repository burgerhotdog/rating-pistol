import { MAINSTAT, SUBSTAT } from '@/data';

export const detectSustain = (gameId, runEquipMap) => {
  const baseTotals = runEquipMap({}).totals;
  let hasHealing = false;
  let hasShield = false;
  const alreadyTested = new Set();

  function testStat({ stat, value }) {
    if (alreadyTested.has(stat)) return;
    alreadyTested.add(stat);

    const statTotals = runEquipMap({ [stat]: value }).totals;

    if (!hasHealing && statTotals.healing > baseTotals.healing) {
      hasHealing = true;
    }

    if (!hasShield && statTotals.shield > baseTotals.shield) {
      hasShield = true;
    }
  }

  for (const mainstatDatas of Object.values(MAINSTAT[gameId])) {
    for (const statData of Object.values(mainstatDatas)) {
      testStat(statData);
      if (hasHealing && hasShield) return ['healing', 'shield'];
    }
  }

  for (const statData of Object.values(SUBSTAT[gameId])) {
    testStat(statData);
    if (hasHealing && hasShield) return ['healing', 'shield'];
  }

  return [
    ...(hasHealing ? ['healing'] : []),
    ...(hasShield ? ['shield'] : []),
  ];
};
