export const getTotals = (summary, filter = {}) => {
  const matchesFilter = ownerId => !filter.ownerId || ownerId === filter.ownerId;
  const totals = { damage: 0, healing: 0, shield: 0 };

  for (const footprintKey in summary) {
    const footprint = summary[footprintKey];
    if (!matchesFilter(footprint.ownerId)) continue;

    totals[footprint.type] += footprint[footprint.type];
  }

  return totals;
};
