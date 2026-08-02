export const sumRotationDmg = (summary, filter = {}) => {
  const { ownerId } = filter;
  let sum = 0;

  for (const result of Object.values(summary)) {
    if (ownerId && ownerId !== result.ownerId) {
      continue;
    }

    if (result.damage) {
      sum += result.damage;
    }
  }

  return sum;
};
