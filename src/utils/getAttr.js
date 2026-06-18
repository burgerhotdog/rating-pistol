export const getAttr = (attr, statMap) => {
  if (!(`BASE_${attr}` in statMap)) {
    return statMap[`PERCENT_${attr}`] ?? 0;
  }

  const base = statMap[`BASE_${attr}`] ?? 0;
  const percent = statMap[`PERCENT_${attr}`] ?? 0;
  const flat = statMap[`FLAT_${attr}`] ?? 0;

  return base * (1 + percent) + flat;
};
