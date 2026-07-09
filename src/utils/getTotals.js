export const getTotals = (summary, filter = {}) => {
  const totals = { damage: 0, healing: 0, shield: 0 };
  const matchesFilter = (ownerId) => {
    return !filter.ownerId || ownerId === filter.ownerId;
  }

  for (const { ownerId, type, value } of Object.values(summary)) {
    if (!matchesFilter(ownerId)) continue;
    totals[type] += value;
  }

  return totals;
};
