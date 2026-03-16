export function combineEquipStats(equipList) {
  const result = {};

  for (const { mainStatId, mainStatValue, subStatList } of equipList) {
    result[mainStatId] = (result[mainStatId] ?? 0) + mainStatValue;

    for (const { subStatId, subStatValue } of subStatList) {
      result[subStatId] = (result[subStatId] ?? 0) + subStatValue;
    }
  }

  return result;
};
