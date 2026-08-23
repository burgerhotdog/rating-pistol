export function buildEquipMap(equipList = [], isTrialBuild = false) {
  const equipMap = {};

  function addToEquipMap(stat, value) {
    const normalized = !isTrialBuild && stat.endsWith('%')
      ? value / 1000
      : value;
    equipMap[stat] = (equipMap[stat] ?? 0) + normalized;
  }

  for (const equip of equipList) {
    if (!equip) continue;

    if ('mainStatId' in equip && equip.mainStatValue) {
      addToEquipMap(equip.mainStatId, equip.mainStatValue);
    }

    if ('mainStatFlatId' in equip && equip.mainStatFlatValue) {
      addToEquipMap(equip.mainStatFlatId, equip.mainStatFlatValue);
    }

    if ('subStatList' in equip) {
      for (const line of equip.subStatList) {
        if (!line) continue;

        if ('subStatId' in line && line.subStatValue) {
          addToEquipMap(line.subStatId, line.subStatValue);
        }
      }
    }
  }

  return equipMap;
}
