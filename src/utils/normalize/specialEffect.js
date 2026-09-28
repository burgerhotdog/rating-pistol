import { CHARACTER, GI } from '@/data';

export function handleSpecialEffect(gameId, effect, spec = {}) {
  const { memberIds, counts } = spec;

  switch (effect.special) {
    case 'gildedDreams': {
      const ownerElement = CHARACTER[GI][effect.ownerId].element;
      const { stats } = effect.buff;

      const numSameAlly = counts.element[ownerElement] - 1;
      if (numSameAlly) {
        stats['atk%'] = 0.14 * numSameAlly;
      }

      const numNotSameAlly = memberIds.length - counts.element[ownerElement];
      if (numNotSameAlly) {
        stats['elementalMastery'] = 50 * numNotSameAlly;
      }

      break;
    }

    case 'yelanA1': {
      const numDiffElements = Object.keys(counts.element).length;
      const { stats } = effect.buff;

      if (numDiffElements === 4) {
        stats['hp%'] = 0.3;
      } else {
        stats['hp%'] = 0.06 * numDiffElements;
      }

      break;
    }
  }
}
