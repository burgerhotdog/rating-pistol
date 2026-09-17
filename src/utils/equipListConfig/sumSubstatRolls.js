import { SUBSTAT } from '@/data';

const normalizeValue = (stat, value) => stat.endsWith('%') ? value / 10000 : value;

export const sumSubstatRolls = (gameId, equipList, isTrialBuild = false) => {
  const substatRolls = {};

  for (const equip of equipList) {
    if (!equip) continue;

    for (const { id, value } of equip.substats) {
      const normalizedValue = isTrialBuild ? value : normalizeValue(id, value);
      const rollMult = normalizedValue / SUBSTAT[gameId][id].value;

      substatRolls[id] = (substatRolls[id] ?? 0) + rollMult;
    }
  }

  return substatRolls;
};
