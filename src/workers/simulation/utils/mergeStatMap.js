export function mergeStatMap(original, statMap, mult = 1) {
  for (const key in statMap) {
    original[key] = (original[key] ?? 0) + statMap[key] * mult;
  }
};
