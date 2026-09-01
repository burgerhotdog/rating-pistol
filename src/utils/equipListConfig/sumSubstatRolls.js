import { SUBSTAT } from '@/data';

const normalizeValue = (id, value) => id.endsWith('%')
  ? value / 10000
  : value;

export const sumSubstatRolls = (gameId, equipList, isTrialBuild = false) => {
  const substatRolls = {};

  for (const equip of equipList) {
    if (!equip) continue;

    for (const { id, value } of equip.substats) {
      const normalizedValue = isTrialBuild ? value : normalizeValue(id, value);
      const rollValue = normalizedValue / SUBSTAT[gameId][id].value;

      substatRolls[id] = (substatRolls[id] ?? 0) + rollValue;
    }
  }

  return substatRolls;
};
