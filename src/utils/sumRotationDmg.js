export const sumRotationDmg = (summary, filter = {}) => {
  const { ownerId } = filter;
  let sum = 0;

  for (const key in summary) {
    const footprintSummary = summary[key];

    if (ownerId && ownerId !== footprintSummary.ownerId) {
      continue;
    }

    if ('damage' in footprintSummary) {
      sum += footprintSummary.damage;
    }
  }

  return sum;
};

export const sumRotationHealing = (summary, filter = {}) => {
  const { ownerId } = filter;
  let sum = 0;

  for (const actionKey in summary) {
    const footprintSummary = summary[actionKey];

    if (ownerId && ownerId !== footprintSummary.ownerId) {
      continue;
    }

    if ('healing' in footprintSummary) {
      sum += footprintSummary.healing;
    }
  }

  return sum;
};
