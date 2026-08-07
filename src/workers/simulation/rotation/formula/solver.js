import { HSR, ZZZ } from '@/data';

function getBaseAttrs(part, compressed) {
  const baseAttrs = new Set();
  baseAttrs.add(`${part}Mv%`);
  baseAttrs.add(`${part}Mv`);
  baseAttrs.add('flat');

  for (const attr of Object.keys(compressed.mvs)) {
    baseAttrs.add(attr);
  }

  return baseAttrs;
}

export function getUsedAttrs(gameId, part, action) {
  const usedAttrs = new Set([...getBaseAttrs(part, action[part].compressed)]);

  switch (part) {
    case 'damage':
      if (action.damage.attr === 'tuneAmp') {
        usedAttrs.add('tuneBreakBoost');
      } else {
        const { type, extraType, element } = action.damage;
        const bonusTypes = [
          element,
          type,
          ...(extraType ? [extraType] : []),
        ];
        usedAttrs.add('critRate%');
        usedAttrs.add('critDmg%');
        usedAttrs.add('dmgBonus%');
        usedAttrs.add('dmgAmp%');
        for (const type of bonusTypes) {
          usedAttrs.add(`${type}DmgBonus%`);
          usedAttrs.add(`${type}DmgAmp%`);
        }
        usedAttrs.add('resReduction%');
        usedAttrs.add(`${element}ResReduction%`);
        const keyword = gameId === HSR ? 'Pen' : 'Ignore';
        usedAttrs.add(`res${keyword}%`);
        usedAttrs.add(`${element}Res${keyword}%`);
        usedAttrs.add('defReduction%');
        if (gameId === ZZZ) {
          usedAttrs.add('penRatio%');
          usedAttrs.add('pen%');
        } else {
          usedAttrs.add('defIgnore%');
        }
        usedAttrs.add('vuln%');
      }
      break;
    case 'healing':
      usedAttrs.add('healingBonus%');
      usedAttrs.add('healingReceived%');
      break;
    case 'shield':
      usedAttrs.add('shieldBonus%');
      break;
  }

  return usedAttrs;
};
