export function toArray(item) {
  if (Array.isArray(item)) return item;
  if (item == null) return [];
  return [item];
}
