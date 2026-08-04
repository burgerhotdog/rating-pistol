function toBaseStat(stat) {
  return `base${stat.charAt(0).toUpperCase()}${stat.slice(1)}`;
}

export function getAttr(attr, statMap) {
  if (attr.endsWith('%')) return statMap[attr] ?? 0;

  const base = statMap[toBaseStat(attr)] ?? 0;
  const percent = statMap[`${attr}%`] ?? 0;
  const flat = statMap[attr] ?? 0;

  return base * (1 + percent) + flat;
}
