import { CHARACTER, GI } from '@/data';
import { toArray } from '../toArray';

export function handleSpecialEffect(gameId, effect, spec = {}) {
  const { memberIds, counts } = spec;

  switch (effect.special) {
    case 'gildedDreams': {
      const ownerElement = CHARACTER[GI][effect.ownerId].element;
      const [{ stats }] = toArray(effect.buff);

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
  }
}
