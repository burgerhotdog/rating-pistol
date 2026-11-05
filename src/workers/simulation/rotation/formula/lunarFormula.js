import { GI } from '@/data';
import { getAttr } from '@/utils';
import { getExclusiveEmBonus } from './getEmBonus';
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

export function runLunarFormula(action, statMap) {
  const { type, element, compressed } = action.damage;

  const rxnMultiplier = type === 'lunarCharged'
    ? 3
    : type === 'lunarBloom'
      ? 1
      : 1.6;

  const emValue = getAttr('elementalMastery', statMap);

  const baseDamage =
    rxnMultiplier *
    computeBase(compressed, statMap) *
    (
      1 +
      getAttr('lunarBaseDmg%', statMap) +
      getAttr(`${type}BaseDmg%`, statMap)
    ) *
    (
      1 +
      getExclusiveEmBonus(emValue) +
      getAttr('lunarReactionBonus%', statMap) +
      getAttr(`${type}ReactionBonus%`, statMap)
    ) +
    getAttr('lunarFlat', statMap) +
    getAttr(`${type}Flat`, statMap);

  return (
    baseDamage *
    getCritMult(statMap) *
    getResMult(GI, element, statMap)
  );
}
