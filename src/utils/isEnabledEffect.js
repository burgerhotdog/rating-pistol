import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from './evaluateFilter';

function evaluateSpecial(special, counts, memberIds, ownerElement, teamSize) {
  switch (special) {
    case 'charlotte1':
    case 'charlotte2':
    case 'charlotte3': {
      const required = Number(special.at(-1));
      const eligible = teamSize - counts.arkhe;

      return eligible === required;
    }

    case 'escoffier1':
    case 'escoffier2':
    case 'escoffier3':
    case 'escoffier4': {
      const required = Number(special.at(-1));
      const eligible = (counts.element.hydro ?? 0) + (counts.element.cryo ?? 0);

      return eligible === required;
    }

    case 'illuga1':
    case 'illuga2':
    case 'illuga3': {
      const required = Number(special.at(-1));
      const eligible = (counts.element.hydro ?? 0) + (counts.element.geo ?? 0);

      if (required === 3) {
        return eligible >= required;
      } else {
        return eligible === required;
      }
    }

    case 'vesnaPassive2Non1':
    case 'vesnaPassive2Non2':
    case 'vesnaPassive2Non3': {
      const required = Number(special.at(-1));
      const eligible = (counts.element.cryo ?? 0) + (counts.element.anemo ?? 0);
      const non = teamSize - eligible;

      return non >= required;
    }

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
