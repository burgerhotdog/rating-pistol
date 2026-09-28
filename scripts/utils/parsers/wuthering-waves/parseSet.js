export function parseSet(entry, data) {
  entry.name = data.name.en;
  entry.bonuses = Object.keys(data.set ?? {});
}
