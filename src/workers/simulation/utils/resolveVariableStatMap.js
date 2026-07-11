import { getAttr } from '@/utils';

export const resolveVariableStatMap = (variableStatMap, sourceStatMap) => {
  const resolved = {};

  for (const [statId, args] of Object.entries(variableStatMap)) {
    resolved[statId] = 0;

    for (const { attr, offset = 0, step, value, max = Infinity } of args) {
      const attrValue = getAttr(attr, sourceStatMap);
      const mult = Math.max((attrValue - offset) / step, 0);

      resolved[statId] += Math.min(value * mult, max);
    }
  }

  return resolved;
};
