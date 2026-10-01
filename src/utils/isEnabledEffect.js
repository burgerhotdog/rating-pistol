import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from './evaluateFilter';

export const isEnabled = (gameId, effect, ownerId, counts) => {
  const owner = CHARACTER[gameId][ownerId];
  const ownerElement = owner.element;

  return evaluateFilter(effect.enable, {
    owner,
    counts,
    sameElementTeamMembers: counts.element[ownerElement],
    ...(gameId === GI && {
      secretRite: counts.hexerei >= 2,
    }),
  });
};
