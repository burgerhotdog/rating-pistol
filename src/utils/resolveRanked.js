export const resolveRankedValue = (value, rank) => {
  const [r1, r5] = value;
  const increment = (r5 - r1) / 4;
  return r1 + increment * (rank - 1);
};

export const resolveRankedStatMap = (rankedStatMap, weaponRank) => {
  if (import.meta.env.DEV) {
    if (!Number.isInteger(weaponRank) || weaponRank < 1 || weaponRank > 5) {
      throw new Error(`Invalid weaponRank: ${weaponRank}`);
    }
  }

  const resolved = {};

  for (const stat in rankedStatMap) {
    resolved[stat] = resolveRankedValue(rankedStatMap[stat], weaponRank);
  }

  return resolved;
};
