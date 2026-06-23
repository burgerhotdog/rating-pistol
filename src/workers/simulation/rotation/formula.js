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

// Resistance and defence reduction multipliers applied to final damage.
// Uses the game's standard resistance brackets and the character-level def formula.
const computeReductions = (config, statMap, element, enemyStatMap) => {
  const { ENEMY_RES, getDefMult } = config;

  const resIgnore = getAttr(`${element}ResIgnore%`, statMap) + getAttr(`${element}ResReduction%`, enemyStatMap);
  const totalRes = ENEMY_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  const defRed = getAttr('defReduction%', enemyStatMap);
  const defIgn = getAttr('defIgnore%', statMap);
  const pen = getAttr('pen', statMap);
  const defMult = getDefMult(defRed, defIgn, pen);

  return resMult * defMult;
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

export const damageFormula = (action, config, statMap) => {
  const { dmgType, extraDmgType, compressed } = action;
  const { enemyStatMap } = config;
  const timesRepeat = action.times * config.repeatCount;
  let sum = 0;

  for (const element in compressed) {
    const base = computeBase(compressed[element], statMap) * timesRepeat;

    switch (action.type) {
      case 'damage': {
        const lowercase = element.toLowerCase();
        const bonusTypes = [lowercase, dmgType, ...(extraDmgType ? [extraDmgType] : [])];

        const bonuses = computeBonuses(statMap, bonusTypes, enemyStatMap);
        const reductions = computeReductions(config, statMap, lowercase, enemyStatMap);

        sum += base * bonuses * reductions;
        break;
      }

      case 'healing': {
        const healingBonus = 1 + getAttr('healingBonus', statMap);
        const healingReceived = 1 + getAttr('healingReceived', statMap);

        sum += base * healingBonus * healingReceived;
        break;
      }

      case 'shield': {
        const shieldBonus = 1 + getAttr('shieldBonus', statMap);

        sum += base * shieldBonus;
        break;
      }
    }
  }

  return sum;
};
