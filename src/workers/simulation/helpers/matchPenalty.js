export function matchPenalty(current, target) {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-1 * relativeDeficit);
}
