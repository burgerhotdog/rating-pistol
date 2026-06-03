export const resolveRankedValue = (value, rank) => {
  if (!Array.isArray(value)) {
    return value;
  }

  const [r1, r5] = value;
  const increment = (r5 - r1) / 4;
  return r1 + increment * (rank - 1);
};
