import { standardIcd } from '../normalizeIcd';

export function normalizeIcd(action, weaponType) {
  const { category, damage } = action;

  if (category === 'normalAttack' && damage.type !== 'plungingAttack') {
    if (weaponType === 'sword' || weaponType === 'claymore') {
      damage.icd ??= { tag: 'Normal Attack', time: 2500, hits: 3 };
    }

    if (weaponType === 'polearm') {
      if (damage.type === 'normalAttack') {
        damage.icd ??= { tag: 'Normal Attack', time: 2500, hits: 3 };
      } else {
        damage.icd ??= { tag: 'Charged Attack', time: 500 };
      }
    }

    if (weaponType === 'catalyst') {
      if (damage.type === 'normalAttack') {
        damage.icd ??= { tag: 'Normal Attack', time: 2500, hits: 3 };
      }
    }
  }

  if (typeof damage.icd === 'string') {
    damage.icd = standardIcd(damage.icd);
  }
}