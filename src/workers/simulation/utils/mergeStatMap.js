export function mergeStatMap(acc, statMap, mult = 1) {
  for (const stat in statMap) {
    acc[stat] = (acc[stat] ?? 0) + statMap[stat] * mult;
  }
};
