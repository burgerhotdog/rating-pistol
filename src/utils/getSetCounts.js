export function getSetCounts(equipList) {
  return equipList.reduce((acc, equip) => {
    const { setId } = equip ?? {};
    if (!setId) return acc;

    acc[setId] = (acc[setId] ?? 0) + 1;
    return acc;
  }, {});
}
