export function mergeStatMap(acc, statMap, mult = 1) {
  for (const key in statMap) {
    acc[key] = (acc[key] ?? 0) + statMap[key] * mult;
  }
};
