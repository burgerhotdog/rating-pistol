export function computeTotalStat(statId, sourceMapList) {
  const baseId = `BASE_${statId}`;
  const flatId = `FLAT_${statId}`;
  const percentId = `PERCENT_${statId}`;

  const totals = {};
  for (const sourceMap of sourceMapList) {
    if (sourceMap[baseId] !== undefined) {
      totals[baseId] = (totals[baseId] ?? 0) + sourceMap[baseId];
    }
    if (sourceMap[flatId] !== undefined) {
      totals[flatId] = (totals[flatId] ?? 0) + sourceMap[flatId];
    }
    if (sourceMap[percentId] !== undefined) {
      totals[percentId] = (totals[percentId] ?? 0) + sourceMap[percentId];
    }
  }

  const totalBase = totals[baseId];
  const totalFlat = totals[flatId] ?? 0;
  const totalPercent = totals[percentId] ?? 0;

  if (totalBase === undefined) {
    return totalPercent;
  }

  return totalBase * (1 + totalPercent) + totalFlat;
};
