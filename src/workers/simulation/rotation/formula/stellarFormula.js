import { GI } from '@/data';
import { getAttr } from '@/utils';
import { getCritMult } from './getCritMult';
import { getResMult } from './enemyRes';

const computeBase = (compressed, statMap) => {
  const { mvs, hitCount } = compressed;
  const mvFlat = getAttr('damageMv', statMap);
  let mvDamageValue = 0;

  for (const attr in mvs) {
    const attrValue = getAttr(attr, statMap);
    const multiplier = mvs[attr] + mvFlat * hitCount;
    mvDamageValue += attrValue * multiplier;
  }

  const mvMultiplier = 1 + getAttr('damageMv%', statMap);
  return mvDamageValue * mvMultiplier;
};

function getEmBonus(em) {
  return (6 * em) / (em + 2000);
}

function stellarConductFormula(action, statMap, reactionMultiplier) {
  const { element, compressed } = action.damage;

  const em = getAttr('elementalMastery', statMap);

  let damageValue =
    reactionMultiplier *
    computeBase(compressed, statMap) *
    (
      1 +
      getAttr('stellarConductBaseDmg%', statMap) +
      getAttr('stellarGlimmerBaseDmg%', statMap)
    ) *
    (
      1 +
      getEmBonus(em) +
      getAttr('stellarConductReactionBonus%', statMap) +
      getAttr('stellarGlimmerReactionBonus%', statMap)
    ) +
    getAttr('stellarGlimmerFlat', statMap);

  damageValue *= getCritMult(statMap);
  damageValue *= getResMult(GI, element, statMap);

  return damageValue;
}

function stellarSwirlFormula(action, statMap) {
  const { element, compressed } = action.damage;

  const em = getAttr('elementalMastery', statMap);

  let damageValue =
    computeBase(compressed, statMap) *
    (
      1 +
      getAttr('stellarSwirlBaseDmg%', statMap) +
      getAttr('stellarGlimmerBaseDmg%', statMap)
    ) *
    (
      1 +
      getEmBonus(em) +
      getAttr('stellarSwirlReactionBonus%', statMap) +
      getAttr('stellarGlimmerReactionBonus%', statMap)
    ) +
    getAttr('stellarGlimmerFlat', statMap);

  damageValue *= getCritMult(statMap);
  damageValue *= getResMult(GI, element, statMap);

  return damageValue;
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
