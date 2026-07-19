import { SUBSTAT_VALUES } from '../stats/values';

export const getSubRollSums = (gameId, equipList) => {
  const MAX_VALUES = SUBSTAT_VALUES[gameId];
  const subStatSums = {};

  for (const equip of equipList) {
    if (!equip) continue;

    for (const { subStatId, subStatValue } of equip.subStatList) {
      subStatSums[subStatId] ??= 0
      subStatSums[subStatId] += subStatValue / MAX_VALUES[subStatId];
    }
  }

  return subStatSums;
};
