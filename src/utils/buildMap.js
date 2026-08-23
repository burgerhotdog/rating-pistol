export function buildEquipMap(equipList = [], isTrialBuild = false) {
  const equipMap = {};

  function addToEquipMap(stat, value) {
    const normalized = !isTrialBuild && stat.endsWith('%')
      ? value / 10000
      : value;
    equipMap[stat] = (equipMap[stat] ?? 0) + normalized;
  }

  for (const equip of equipList) {
    if (!equip) continue;

    if ('mainstatId' in equip && equip.mainstatValue) {
      addToEquipMap(equip.mainstatId, equip.mainstatValue);
    }

    if ('mainstatSubId' in equip && equip.mainstatSubValue) {
      addToEquipMap(equip.mainstatSubId, equip.mainstatSubValue);
    }

    if ('substats' in equip) {
      for (const line of equip.substats) {
        if (!line) continue;

        if ('id' in line && line.value) {
          addToEquipMap(line.id, line.value);
        }
      }
    }
  }

  return equipMap;
}
