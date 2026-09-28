export function parseSet(entry, data) {
  entry.bonuses = Object.keys(data.require_num ?? {});
}
