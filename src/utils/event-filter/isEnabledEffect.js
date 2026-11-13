import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from './evaluateFilter';

function evaluateSpecial(special, memberIds, ownerElement) {
  switch (special) {
    case 'chainBreaker1':
    case 'chainBreaker2':
    case 'chainBreaker3':
    case 'chainBreaker4': {
      const required = Number(special.at(-1));
      const eligible = memberIds.filter((id) => {
        const { nightsoul, element } = CHARACTER[GI][id];
        return nightsoul || element !== ownerElement;
      }).length;

      return eligible == required;
    }
  }
}

export const isEnabled = (gameId, rawEffect, ownerId, counts, memberIds) => {
  const owner = CHARACTER[gameId][ownerId];
  const ownerElement = owner.element;
  const teamSize = memberIds.length;

  if (rawEffect.enable?.special) {
    return evaluateSpecial(rawEffect.enable.special, memberIds, ownerElement);
  }

  return evaluateFilter({
    owner,
    counts,
    uniqueElementCount: Object.values(counts.element).filter((count) => count > 0).length,
    sameElementTeamMembers: counts.element[ownerElement],
    diffElementTeamMembers: teamSize - counts.element[ownerElement],
    ...(gameId === GI && {
      nascentGleam: counts.moonsign === 1,
      ascendantGleam: counts.moonsign >= 2,
      secretRite: counts.hexerei >= 2,
    }),
  }, rawEffect.enable);
};
