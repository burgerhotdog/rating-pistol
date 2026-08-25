export function toMergedObj(...objects) {
  const merged = {};

  for (const obj of objects) {
    for (const key in obj) {
      merged[key] = (merged[key] ?? 0)
        + obj[key];
    }
  }

  return merged;
}
