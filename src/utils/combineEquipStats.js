export function combineEquipStats(equipList) {
  const result = {};

  for (const item of equipList) {
    if (!item) continue;
    const { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList } = item;
    result[mainStatId] = (result[mainStatId] ?? 0) + mainStatValue;

    if (mainStatFlatId) {
      result[mainStatFlatId] = (result[mainStatFlatId] ?? 0) + mainStatFlatValue;
    }

    for (const { subStatId, subStatValue } of subStatList) {
      result[subStatId] = (result[subStatId] ?? 0) + subStatValue;
    }
  }

  return result;
}
