export function mergeStatMaps(...maps) {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, value] of Object.entries(map)) {
      acc[statId] = (acc[statId] ?? 0) + value;
    }
    return acc;
  }, {});
}
