export function sumRotationDmg(summary, filters = {}) {
  const { ownerId } = filters;
  const { byMember, other } = summary;
  const result = {};

  for (const [memberId, actionMap] of Object.entries(byMember)) {
    if (ownerId && ownerId !== memberId) continue;

    for (const [shortKey, actionSummary] of Object.entries(actionMap)) {
      for (const [key, value] of Object.entries(actionSummary)) {
        result[key] ??= 0;
        result[key] += value;
      }
    }
  }

  return result.damage ?? 0;
}
