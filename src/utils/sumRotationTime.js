import { getActionMeta } from './getActionMeta';

export function sumRotationTime(gameId, team, filters = {}) {
  return team.reduce((total, { memberId, rotation = [] }) => {
    if (filters.ownerId && filters.ownerId !== memberId) return total;
    return total + rotation.reduce((sum, actionKey) => {
      const { duration = 1000 } = getActionMeta(gameId, actionKey);
      return sum + duration;
    }, 0);
  }, 0);
}
