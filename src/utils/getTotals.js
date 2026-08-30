const PARTS = new Set(['damage', 'healing', 'shield']);

export function getTotals(snapshots, filterId) {
  const totals = { damage: 0, healing: 0, shield: 0 };

  for (const snapshot of snapshots) {
    if (filterId && snapshot.ownerId !== filterId) continue;

    for (const part of PARTS) {
      totals[part] += snapshot[part] ?? 0;
    }
  }

  return totals;
}
