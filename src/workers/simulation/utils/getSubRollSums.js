import { MISC } from '@/data';

export const getSubRollSums = (gameId, equipList) => {
  const { SUB_STAT_TYPES } = MISC[gameId];
  const subStatSums = {};

  for (const equip of equipList) {
    if (!equip) continue;

    for (const { subStatId, subStatValue } of equip.subStatList) {
      const maxRoll = SUB_STAT_TYPES[subStatId].VALUE;
      subStatSums[subStatId] = (subStatSums[subStatId] ?? 0) + subStatValue / maxRoll;
    }
  }

  return subStatSums;
};
