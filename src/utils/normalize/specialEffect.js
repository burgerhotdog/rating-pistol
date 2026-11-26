import { CHARACTER, GI } from '@/data';
import { toArray } from '../toArray';
import { resolveRankedValue } from '../resolve';

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

    case 'akuoumaru':
    case 'mouunsMoon':
    case 'wavebreakersFin': {
      let totalEnergy = 0;

      for (const memberId of memberIds) {
        const { energy = 0 } = CHARACTER[GI][memberId];
        totalEnergy += energy;
      }

      const value = resolveRankedValue([0.0012, 0.0024], spec.weaponRank);
      const maxValue = resolveRankedValue([0.4, 0.8], spec.weaponRank);

      effect.buff.stats['dmgBonus%'] = Math.min(maxValue, value * totalEnergy);

      break;
    }
  }
}
