import { getAttr } from '../getAttr';

export const resolveSpecs = (specs, sourceMap) => {
  const resolved = {};

  for (const stat in specs) {
    const { attr, step, value, offset = 0, maxValue = Infinity } = specs[stat];

    const attrValue = getAttr(attr, sourceMap);
    if (attrValue <= offset) continue;

    const statValue = (attrValue - offset) / step * value;
    resolved[stat] = Math.min(statValue, maxValue);
  }

  return resolved;
};

export const resolveBuffSpecs = (buffSpecs, sourceMap) => {
  const resolved = {};

  for (const { specs, buffMult } of buffSpecs) {
    const statMap = resolveSpecs(specs, sourceMap);

    for (const stat in statMap) {
      resolved[stat] = (resolved[stat] ?? 0) + statMap[stat] * buffMult;
    }
  }

  return resolved;
};
