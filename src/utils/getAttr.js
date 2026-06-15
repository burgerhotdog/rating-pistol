export const getAttr = (attr, statMap) => {
  const baseValue = statMap[`BASE_${attr}`];
  const percentValue = statMap[`PERCENT_${attr}`] ?? 0;
  const flatValue = statMap[`FLAT_${attr}`] ?? 0;

  if (baseValue === undefined) {
    return percentValue;
  }

  return baseValue * (1 + percentValue) + flatValue;
};
