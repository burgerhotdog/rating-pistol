import { getAttr } from '@/utils/getAttr';

function matchPenalty(current, target) {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-1 * relativeDeficit);
}

export const getPenalty = (statMap, matchMap) => {
  let penalty = 1;

  for (const attr in matchMap) {
    const currentValue = getAttr(attr, statMap);
    const targetValue = matchMap[attr];
    penalty *= matchPenalty(currentValue, targetValue)
  }

  return penalty;
};
