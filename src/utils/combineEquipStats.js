export function combineEquipStats(equipList) {
  const result = {};

  for (const item of equipList) {
    if (!item) continue;
    const { mainStatId, mainStatValue, subStatList } = item;
    result[mainStatId] = (result[mainStatId] ?? 0) + mainStatValue;

    for (const { subStatId, subStatValue } of subStatList) {
      result[subStatId] = (result[subStatId] ?? 0) + subStatValue;
    }
  }

  return result;
};
