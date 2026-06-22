const toBaseStat = (str) => `base${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const getAttr = (attr, statMap) => {
  if (attr.endsWith('%')) {
    return statMap[attr] ?? 0;
  } else {
    const base = statMap[toBaseStat(attr)] ?? 0;
    const percent = statMap[`${attr}%`] ?? 0;
    const flat = statMap[attr] ?? 0;

    return base * (1 + percent) + flat;
  }
};
