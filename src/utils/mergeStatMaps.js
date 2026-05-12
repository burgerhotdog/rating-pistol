export const mergeStatMaps = (...maps) => {
  const merged = {};

  for (const map of maps) {
    if (!map) continue;

    for (const stat in map) {
      merged[stat] = (merged[stat] ?? 0) + map[stat];
    }
  }

  return merged;
};
