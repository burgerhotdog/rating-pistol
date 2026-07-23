import { getAttr } from '@/utils';

export const resolveStatSpecs = (statSpecs, sourceStatMap) => {
  const resolved = {};

  for (const [statId, spec] of Object.entries(statSpecs)) {
    const {
      attr, offset = 0, step,
      value, maxValue = Infinity,
    } = spec;

    const attrValue = getAttr(attr, sourceStatMap);
    const mult = Math.max((attrValue - offset) / step, 0);
    resolved[statId] = Math.min(value * mult, maxValue);
  }

  return resolved;
};
