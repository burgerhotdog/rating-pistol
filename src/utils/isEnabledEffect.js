import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from './evaluateFilter';

function evaluateSpecial(special, counts, memberIds, ownerElement, teamSize) {
  switch (special) {
    case 'vesnaPassive2Non1':
      return teamSize - (counts.element.cryo ?? 0) - (counts.element.anemo ?? 0) >= 1;
    case 'vesnaPassive2Non2':
      return teamSize - (counts.element.cryo ?? 0) - (counts.element.anemo ?? 0) >= 2;
    case 'vesnaPassive2Non3':
      return teamSize - (counts.element.cryo ?? 0) - (counts.element.anemo ?? 0) >= 3;

    case 'chainBreaker1':
    case 'chainBreaker2':
    case 'chainBreaker3':
    case 'chainBreaker4': {
      const required = Number(special.at(-1));
      const eligible = memberIds.filter((id) => {
        const { nightsoul, element } = CHARACTER[GI][id];
        return nightsoul || element !== ownerElement;
      }).length;

      return eligible >= required;
    }
  }
}

export const isEnabled = (gameId, effect, ownerId, counts, memberIds) => {
  const owner = CHARACTER[gameId][ownerId];
  const ownerElement = owner.element;
  const teamSize = memberIds.length;

  if (effect.enable?.special) {
    return evaluateSpecial(effect.enable.special, counts, memberIds, ownerElement, teamSize);
  }

  return evaluateFilter(effect.enable, {
    owner,
    counts,
    sameElementTeamMembers: counts.element[ownerElement],
    diffElementTeamMembers: teamSize - counts.element[ownerElement],
    ...(gameId === GI && {
      nascentGleam: counts.moonsign === 1,
      ascendantGleam: counts.moonsign >= 2,
      secretRite: counts.hexerei >= 2,
    }),
  });
};
