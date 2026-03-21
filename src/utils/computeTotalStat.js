export function computeTotalStat(rawStat, sourceMapList) {
  const baseId = `BASE_${rawStat}`;
  const flatId = `FLAT_${rawStat}`;
  const percentId = `PERCENT_${rawStat}`;

  const totals = {};
  for (const sourceMap of sourceMapList) {
    if (sourceMap[baseId]) {
      totals[baseId] = (totals[baseId] ?? 0) + sourceMap[baseId];
    }
    if (sourceMap[flatId]) {
      totals[flatId] = (totals[flatId] ?? 0) + sourceMap[flatId];
    }
    if (sourceMap[percentId]) {
      totals[percentId] = (totals[percentId] ?? 0) + sourceMap[percentId];
    }
  }

  const totalBase = totals[baseId] ?? 0;
  const totalFlat = totals[flatId] ?? 0;
  const totalPercent = totals[percentId] ?? 0;

  if (!totalBase) {
    return { totalValue: totalPercent, isPercent: true };
  }

  const totalValue = totalBase * (1 + totalPercent) + totalFlat;
  return { totalValue, isPercent: false }
};
