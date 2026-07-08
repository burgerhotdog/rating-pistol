import { getAttr } from '@/utils';
import { getCritMult } from './crit';
import { getDmgBonusMult } from './dmgBonus';
import { getDmgAmpMult } from './dmgAmp';

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

export const runDamageFormula = (helpers, action, config, statMap) => {
  const { getResMult, getDefMult } = helpers;
  const { dmgType, extraDmgType, compressed } = action;
  const { enemyStatMap } = config;
  const timesRepeat = action.times * config.repeatCount;

  let sum = 0;
  for (const [element, params] of Object.entries(compressed)) {
    const baseValue = computeBase(params, statMap) * timesRepeat;

    switch (action.type) {
      case 'damage': {
        const critMult = getCritMult(statMap);

        const bonusTypes = [element, dmgType, ...(extraDmgType ? [extraDmgType] : [])];
        const dmgBonusMult = getDmgBonusMult(enemyStatMap, statMap, bonusTypes);
        const dmgAmpMult = getDmgAmpMult(enemyStatMap, statMap, bonusTypes);

        const resMult = getResMult(element, enemyStatMap, statMap);
        const defMult = getDefMult(enemyStatMap, statMap);

        const damageValue =
          baseValue *
          critMult * dmgBonusMult * dmgAmpMult *
          resMult * defMult;

        sum += damageValue;
        break;
      }

      case 'healing': {
        const healingBonus = 1 + getAttr('healingBonus%', statMap);
        const healingReceived = 1 + getAttr('healingReceived%', statMap);

        const healingValue =
          baseValue *
          healingBonus * healingReceived;

        sum += healingValue;
        break;
      }

      case 'shield': {
        const shieldBonus = 1 + getAttr('shieldBonus%', statMap);

        const shieldValue =
          baseValue *
          shieldBonus;

        sum += shieldValue;
        break;
      }
    }
  }

  return sum;
};
