export const mergeStatMaps = (...maps) => {
  const merged = {};

  for (const map of maps) {
    if (!map) continue;

    for (const stat in map) {
      merged[stat] ??= 0;
      merged[stat] += map[stat];
    }
  }

  return merged;
};
