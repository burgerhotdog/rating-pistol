import { getSkill } from './getSkill';

export function sumRotationTime(gameId, team, filters = {}) {
  return team.reduce((total, { memberId, rotation = [] }) => {
    if (filters.ownerId && filters.ownerId !== memberId) return total;
    return total + rotation.reduce((sum, actionKey) => {
      try {
        const { duration } = getSkill(gameId, actionKey);
        return sum + (duration || 1000);
      } catch {
        return sum + 1000;
      }
    }, 0);
  }, 0);
}
