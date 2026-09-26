import { HSR, ZZZ } from '@/data';
import { getBonusTypes } from './damageFormula';

function handleDamageAttrs(usedAttrs, gameId, action) {
  const { type, element } = action.damage;
  const bonusTypes = getBonusTypes(gameId, action.damage);
  const keyword = gameId === HSR ? 'Pen' : 'Ignore';
  const isStellar = type === 'stellarConduct' || type === 'stellarSwirl';
  const stellarType = isStellar ? type : null;

  usedAttrs.add('critRate%');
  usedAttrs.add('critDmg%');

  if (!isStellar) {
    usedAttrs.add('dmgBonus%');
    usedAttrs.add('dmgAmp%');
    for (const type of bonusTypes) {
      usedAttrs.add(`${type}DmgBonus%`);
      usedAttrs.add(`${type}DmgAmp%`);
    }
    usedAttrs.add('defReduction%');

    if (gameId === ZZZ) {
      usedAttrs.add('penRatio%');
      usedAttrs.add('pen%');
    } else {
      usedAttrs.add('defIgnore%');
    }
  } else {
    usedAttrs.add('stellarGlimmerReactionBonus%');
    usedAttrs.add(`${stellarType}ReactionBonus%`);
    usedAttrs.add('stellarGlimmerBaseDmg%');
    usedAttrs.add(`${stellarType}BaseDmg%`);
    usedAttrs.add('elementalMastery');
  }

  usedAttrs.add('resReduction%');
  usedAttrs.add(`${element}ResReduction%`);
  usedAttrs.add(`res${keyword}%`);
  usedAttrs.add(`${element}Res${keyword}%`);

  usedAttrs.add('vuln%');
  usedAttrs.add('attackSpd%');
}

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
        break;
      }

      handleDamageAttrs(usedAttrs, gameId, action);
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
