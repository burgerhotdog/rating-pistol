export function mergeEquipList(equipList) {
  const result = {};

  for (const item of equipList) {
    if (!item) continue;
    const { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList } = item;
    
    // Main stat
    result[mainStatId] = (result[mainStatId] ?? 0) + mainStatValue;

    // Main stat flat value (ww)
    if (mainStatFlatId) {
      result[mainStatFlatId] = (result[mainStatFlatId] ?? 0) + mainStatFlatValue;
    }

    // Sub stats
    for (const line of subStatList) {
      if (!line) continue;
      const { subStatId, subStatValue } = line;
      if (!subStatId || !subStatValue) continue;
      result[subStatId] = (result[subStatId] ?? 0) + subStatValue;
    }
  }

  return result;
}
