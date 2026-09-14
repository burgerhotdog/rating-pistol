export function getStatIcon(gameId, stat) {
  const kebab = stat
    .replace(/%$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  return `${gameId}/stat/${kebab}.webp`;
}
