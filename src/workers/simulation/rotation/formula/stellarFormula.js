import { GI } from '@/data';
import { clamp, getAttr } from '@/utils';
import { getResMult } from './enemyRes';

const computeBase = (compressed, statMap) => {
  const { mvs, hitCount } = compressed;
  let totalMvPart = 0;

  for (const [attr, mv] of Object.entries(mvs)) {
    const attrValue = getAttr(attr, statMap);
    totalMvPart += attrValue * (mv * hitCount);
  }

  return totalMvPart;
};

function getEmBonus(em) {
  return (6 * em) / (em + 2000);
}

const critMultiplier = (statMap) => {
  const critRate = clamp(getAttr('critRate%', statMap), 0, 1);
  const critDamage = getAttr('critDmg%', statMap);

  return critRate * (1 + critDamage) + (1 - critRate);
};

function stellarConductFormula(action, statMap, reactionMultiplier) {
  const { element, compressed } = action.damage;

  const em = getAttr('elementalMastery', statMap);

  let damageValue =
    reactionMultiplier *
    computeBase(compressed, statMap) *
    (1 + getAttr('stellarConductBaseDmgBonus%', statMap)) *
    (1 + getEmBonus(em) + getAttr('stellarConductReactionBonus%', statMap)) +
    getAttr('stellarConductFlat', statMap);

  damageValue *= critMultiplier(statMap);
  damageValue *= getResMult(GI, element, statMap);

  return damageValue;
}

function stellarSwirlFormula(action, statMap) {
  return;
}

export function runStellarFormula(action, statMap, reactionMultiplier) {
  const { type } = action.damage;

  if (type === 'stellarConduct') {
    return stellarConductFormula(action, statMap, reactionMultiplier);
  }


  if (type === 'stellarSwirl') {
    return stellarSwirlFormula(action, statMap, reactionMultiplier);
  }
}
