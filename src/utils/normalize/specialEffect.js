import { CHARACTER, GI } from '@/data';

export function handleSpecialEffect(gameId, effect, spec) {
  if (gameId === GI) {
    if (effect.special === 'gildedDreams') {
      const ownerElement = CHARACTER[GI][effect.ownerId].element;

      const stats = effect.buff.stats = {};

      const numSameAlly = spec.counts.element[ownerElement] - 1;
      if (numSameAlly) {
        stats['atk%'] = 0.14 * numSameAlly;
      }

      const numNotSameAlly = spec.memberIds.length - spec.counts.element[ownerElement];
      if (numNotSameAlly) {
        stats['elementalMastery'] = 50 * numNotSameAlly;
      }
    }
  }
}
