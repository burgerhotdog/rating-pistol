export function getTotals(summary, filter = {}) {
  const totals = { damage: 0, healing: 0, shield: 0 };
  const matchesFilter = (ownerId) =>
    !filter.ownerId || ownerId === filter.ownerId;

  for (const snapshot of summary) {
    if (!matchesFilter(snapshot.ownerId)) continue;
    for (const part in totals) {
      if (part in snapshot) {
        totals[part] += snapshot[part];
      }
    }
  }

  return totals;
}
