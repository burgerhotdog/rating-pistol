export function toMergedObj(...objects) {
  const merged = {};

  for (const obj of objects) {
    for (const key in obj) {
      merged[key] = (merged[key] ?? 0)
        + obj[key];
    }
  }

  return merged;
}

export function toEquipMap(equipList = []) {
  const equipMap = {};

  for (const equip of equipList) {
    if (!equip) continue;

    const {
      mainStatId, mainStatValue,
      mainStatFlatId, mainStatFlatValue,
      subStatList,
    } = equip;

    if (mainStatId && mainStatValue) {
      equipMap[mainStatId] = (equipMap[mainStatId] ?? 0)
        + mainStatValue;
    }

    if (mainStatFlatId && mainStatFlatValue) {
      equipMap[mainStatFlatId] = (equipMap[mainStatFlatId] ?? 0)
        + mainStatFlatValue;
    }

    if (subStatList) {
      for (const line of subStatList) {
        if (!line) continue;
        const { subStatId, subStatValue } = line;
        if (subStatId && subStatValue) {
          equipMap[subStatId] = (equipMap[subStatId] ?? 0)
            + subStatValue;
        }
      }
    }
  }

  return equipMap;
}
