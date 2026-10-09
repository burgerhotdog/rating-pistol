import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from './evaluateFilter';

function evaluateSpecial(special, counts, teamSize) {
  switch (special) {
    case 'vesnaPassive2Non1':
      return teamSize - (counts.element.cryo ?? 0) - (counts.element.anemo ?? 0) >= 1;
    case 'vesnaPassive2Non2':
      return teamSize - (counts.element.cryo ?? 0) - (counts.element.anemo ?? 0) >= 2;
    case 'vesnaPassive2Non3':
      return teamSize - (counts.element.cryo ?? 0) - (counts.element.anemo ?? 0) >= 3;
  }
}

export const isEnabled = (gameId, effect, ownerId, counts, memberIds) => {
  const owner = CHARACTER[gameId][ownerId];
  const ownerElement = owner.element;
  const teamSize = memberIds.length;

  if (effect.enable?.special) {
    return evaluateSpecial(effect.enable.special, counts, teamSize);
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
