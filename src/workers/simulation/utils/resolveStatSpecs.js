import { getAttr } from '@/utils';

export const resolveStatSpecs = (buffSpec, sourceStatMap) => {
  const resolved = {};

  for (const [statId, statSpec] of Object.entries(buffSpec)) {
    const {
      attr, offset = 0, step,
      value, maxValue = Infinity,
    } = statSpec;

    const attrValue = getAttr(attr, sourceStatMap);
    const mult = Math.max((attrValue - offset) / step, 0);
    resolved[statId] = Math.min(value * mult, maxValue);
  }

  return resolved;
};
