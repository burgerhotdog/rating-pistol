import { SUBSTAT } from '@/data';

export const getSubRollSums = (gameId, equipList, isTrialBuild = false) => {
  const substatSums = {};

  function addToSums(stat, value) {
    const maxRoll = SUBSTAT[gameId][stat].value;
    const normalized = !isTrialBuild && stat.endsWith('%')
      ? value / 10000
      : value;
    substatSums[stat] = (substatSums[stat] ?? 0) + normalized / maxRoll;
  }

  for (const equip of equipList) {
    if (!equip) continue;

    for (const { id, value } of equip.substats) {
      addToSums(id, value);
    }
  }

  return substatSums;
};
