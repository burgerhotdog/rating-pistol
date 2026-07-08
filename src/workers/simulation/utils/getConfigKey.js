import { WW } from '@/data';

const STAT_ORDER = [
  'healingBonus%',
  'critRate%',
  'critDmg%',
  'glacioDmgBonus%',
  'fusionDmgBonus%',
  'electroDmgBonus%',
  'aeroDmgBonus%',
  'spectroDmgBonus%',
  'havocDmgBonus%',
  'energyRegen%',
  'atk%',
  'hp%',
  'def%',
];

const STAT_INDEX = Object.fromEntries(
  STAT_ORDER.map((id, index) => [id, index])
);

export const getMainConfig = (gameId, equipList) => {
  // Hoyo mainstats have fixed slots
  if (gameId !== WW) {
    const mainstats = equipList.map((equip) => equip?.mainStatId ?? 'none');
    return mainstats.join('|');
  }

  // Wuwa mainstats can have multiple orders due to cost system
  const mainStatCounts = { 4: {}, 3: {}, 1: {} };
  for (const equip of equipList) {
    if (!equip) continue;
    const { cost, mainStatId } = equip;

    mainStatCounts[cost][mainStatId] ??= 0;
    mainStatCounts[cost][mainStatId]++;
  }

  return Object.values(mainStatCounts)
    .reverse()
    .flatMap((countMap) =>
      Object.entries(countMap)
        .sort(([aId], [bId]) => STAT_INDEX[aId] - STAT_INDEX[bId])
        .map(([, count]) => count)
    )
    .join('|');
};
