export const sumRotationDmg = (summary, filter = {}) => {
  const { ownerId } = filter;
  let result = 0;

  for (const actionKey in summary) {
    const actionSummary = summary[actionKey];

    if (ownerId && ownerId !== actionSummary.ownerId) {
      continue;
    }

    result += actionSummary.damage;
  }

  return result;
};
