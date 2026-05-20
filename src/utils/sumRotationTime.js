import { normalizeAction } from '@/utils';

export function sumRotationTime(gameId, team, filters = {}) {
  return team.reduce((total, { memberId, rotation = [] }) => {
    if (filters.ownerId && filters.ownerId !== memberId) return total;
    return total + rotation.reduce((sum, actionKey) => {
      const [ownerId, skillId, actionId] = actionKey.split('-');
      const { duration } = normalizeAction(gameId, ownerId, skillId, actionId);
      return sum + duration;
    }, 0);
  }, 0);
}
