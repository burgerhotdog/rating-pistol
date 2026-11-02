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

const getBaseDmgBonus = (statMap, type) =>
  getAttr('stellarGlimmerBaseDmg%', statMap) +
  getAttr(`${type}BaseDmg%`, statMap);

const getEmBonus = (statMap) => {
  const emValue = getAttr('elementalMastery', statMap);
  return (6 * emValue) / (emValue + 2000);
};

const getRxnBonus = (statMap, type) =>
  getAttr('stellarGlimmerReactionBonus%', statMap) +
  getAttr(`${type}ReactionBonus%`, statMap);

const getRxnFlat = (statMap, type) =>
  getAttr('stellarGlimmerFlat', statMap) +
  getAttr(`${type}Flat`, statMap);

export function runStellarFormula(action, statMap, rxnMult = 1) {
  const { type, element, compressed } = action.damage;

  const rxnDamage =
    rxnMult *
    computeBase(compressed, statMap) *
    (1 + getBaseDmgBonus(statMap, type)) *
    (1 + getEmBonus(statMap) + getRxnBonus(statMap, type)) +
    getRxnFlat(statMap, type);

  return (
    rxnDamage *
    getCritMult(statMap) *
    getResMult(GI, element, statMap)
  );
}
