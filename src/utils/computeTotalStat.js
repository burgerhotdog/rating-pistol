export function computeTotalStat(statId, statMap) {
  const baseId = `BASE_${statId}`;
  const percentId = `PERCENT_${statId}`;
  const flatId = `FLAT_${statId}`;

  const baseValue = statMap[baseId];
  const percentValue = statMap[percentId] ?? 0;
  const flatValue = statMap[flatId] ?? 0;

  if (baseValue === undefined) return percentValue;
  return baseValue * (1 + percentValue) + flatValue;
}
