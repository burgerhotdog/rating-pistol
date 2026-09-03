import { HSR, ZZZ } from '@/data';

export function getUsedAttrs(gameId, action, part) {
  const usedAttrs = new Set();

  usedAttrs.add(`${part}Mv%`);
  usedAttrs.add(`${part}Mv`);
  usedAttrs.add(`${part}Flat`);
  for (const attr of Object.keys(action[part].compressed.mvs)) {
    usedAttrs.add(attr);
    if (!attr.endsWith('%')) {
      usedAttrs.add(`${attr}%`);
    }
  }

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
