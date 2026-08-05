export function getTotals(summary, filter = {}) {
  const totals = { damage: 0, healing: 0, shield: 0 };
  const matchesFilter = (ownerId) =>
    !filter.ownerId || ownerId === filter.ownerId;

  for (const snapshot of summary) {
    if (!matchesFilter(snapshot.ownerId)) continue;
    for (const key in totals) {
      if (key in snapshot) {
        totals[key] += snapshot[key];
      }
    }
  }

  return totals;
}
