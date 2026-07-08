import { getAttr } from '@/utils';

const computeBase = (compressed, statMap) => {
  const percentMv = getAttr('mv%', statMap);
  const flatMv = getAttr('mv', statMap);
  let totalMvPart = 0;

  for (const attr in compressed.mv) {
    const attrValue = getAttr(attr, statMap);
    const mv = compressed.mv[attr] ?? 0;

    totalMvPart += attrValue * (mv + flatMv * compressed.hitCount);
  }

  const flatBuff = getAttr('flat', statMap) * compressed.hitCount;

  return totalMvPart * (1 + percentMv) + compressed.flat + flatBuff;
};

const computeBonuses = (statMap, bonusTypes, enemyStatMap) => {
  const critRate = Math.max(Math.min(getAttr('critRate%', statMap), 1), 0);
  const critDamage = getAttr('critDmg%', statMap);
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  let dmgBonusMult = 1 + getAttr('dmgBonus%', statMap) + getAttr('dmgBonus%', enemyStatMap);
  let ampMult = 1 + getAttr('dmgAmp%', statMap) + getAttr('dmgAmp%', enemyStatMap);

  for (const type of bonusTypes) {
    dmgBonusMult += getAttr(`${type}DmgBonus%`, statMap) + getAttr(`${type}DmgBonus%`, enemyStatMap);
    ampMult += getAttr(`${type}DmgAmp%`, statMap) + getAttr(`${type}DmgAmp%`, enemyStatMap);
  }

  return critMult * dmgBonusMult * ampMult;
};

export const damageFormula = (helpers, action, config, statMap) => {
  const { getResMult, getDefMult } = helpers;
  const { dmgType, extraDmgType, compressed } = action;
  const { enemyStatMap } = config;
  const timesRepeat = action.times * config.repeatCount;
  let sum = 0;

  for (const element in compressed) {
    const base = computeBase(compressed[element], statMap) * timesRepeat;

    switch (action.type) {
      case 'damage': {
        const bonusTypes = [element, dmgType, ...(extraDmgType ? [extraDmgType] : [])];

        const bonuses = computeBonuses(statMap, bonusTypes, enemyStatMap);
        const resMult = getResMult(element, enemyStatMap, statMap);
        const defMult = getDefMult(enemyStatMap, statMap);

        sum += base * bonuses * resMult * defMult;
        break;
      }

      case 'healing': {
        const healingBonus = 1 + getAttr('healingBonus%', statMap);
        const healingReceived = 1 + getAttr('healingReceived%', statMap);

        sum += base * healingBonus * healingReceived;
        break;
      }

      case 'shield': {
        const shieldBonus = 1 + getAttr('shieldBonus%', statMap);

        sum += base * shieldBonus;
        break;
      }
    }
  }

  return sum;
};
