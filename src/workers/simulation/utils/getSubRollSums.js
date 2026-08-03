import { SUBSTAT } from '@/data';

export const getSubRollSums = (gameId, equipList) => {
  const subStatSums = {};

  for (const equip of equipList) {
    if (!equip) continue;

    for (const { subStatId, subStatValue } of equip.subStatList) {
      subStatSums[subStatId] ??= 0
      subStatSums[subStatId] += subStatValue / SUBSTAT[gameId][subStatId].value;
    }
  }

  return subStatSums;
};
