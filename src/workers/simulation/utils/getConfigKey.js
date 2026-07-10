import { WW } from '@/data';

const ORDER = {
  'healingBonus%': 1,
  'critRate%': 2,
  'critDmg%': 3,
  'glacioDmgBonus%': 4,
  'fusionDmgBonus%': 5,
  'electroDmgBonus%': 6,
  'aeroDmgBonus%': 7,
  'spectroDmgBonus%': 8,
  'havocDmgBonus%': 9,
  'energyRegen%': 10,
  'atk%': 11,
  'hp%': 12,
  'def%': 13,
};

export const getMainConfig = (gameId, equipList) => {
  // Hoyo mainstats have fixed slots
  if (gameId !== WW) {
    const mainstats = equipList.map((equip) => equip?.mainStatId ?? 'none');
    return mainstats.join('|');
  }

  // Wuwa mainstats can have multiple orders due to cost system
  const mainStatCounts = {};
  for (const equip of equipList) {
    if (!equip) continue;
    const { cost, mainStatId } = equip;

    mainStatCounts[cost] ??= [];
    mainStatCounts[cost].push(mainStatId);
  }

  return Object.values(mainStatCounts)
    .reverse()
    .flatMap((statIds) => statIds.sort((a, b) => ORDER[a] - ORDER[b]))
    .join('|');
};
