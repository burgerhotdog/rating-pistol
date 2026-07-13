import { getAttr } from '@/utils';
import { getCritMult } from './crit';
import { getDmgBonusMult } from './dmgBonus';
import { getDmgAmpMult } from './dmgAmp';

const computeBase = (compressed, statMap) => {
  const { flat, mvs, hitCount } = compressed;
  const percentMv = getAttr('mv%', statMap);
  const flatMv = getAttr('mv', statMap);
  let totalMvPart = 0;

  for (const [attr, mv] of Object.entries(mvs)) {
    const attrValue = getAttr(attr, statMap);
    totalMvPart += attrValue * (mv + flatMv * hitCount);
  }

  const flatBuff = getAttr('flat', statMap) * hitCount;

  return totalMvPart * (1 + percentMv) + flat + flatBuff;
};

export const runDamageFormula = (helpers, action, enemyMap, statMap) => {
  const { getResMult, getDefMult } = helpers;
  const { dmgType, extraDmgType, element, compressed } = action;

  const baseValue = computeBase(compressed, statMap) * action.times;

  switch (action.type) {
    case 'damage': {
      const critMult = getCritMult(statMap);

      const bonusTypes = [element, dmgType, ...(extraDmgType ? [extraDmgType] : [])];
      const dmgBonusMult = getDmgBonusMult(enemyMap, statMap, bonusTypes);
      const dmgAmpMult = getDmgAmpMult(enemyMap, statMap, bonusTypes);

      const resMult = getResMult(element, enemyMap, statMap);
      const defMult = getDefMult(enemyMap, statMap);

      const damageValue =
        baseValue *
        critMult * dmgBonusMult * dmgAmpMult *
        resMult * defMult;

      return damageValue;
    }

    case 'healing': {
      const healingBonus = 1 + getAttr('healingBonus%', statMap);
      const healingReceived = 1 + getAttr('healingReceived%', statMap);

      const healingValue =
        baseValue *
        healingBonus * healingReceived;

      return healingValue;
    }

    case 'shield': {
      const shieldBonus = 1 + getAttr('shieldBonus%', statMap);

      const shieldValue =
        baseValue *
        shieldBonus;

      return shieldValue;
    }
  }
};
