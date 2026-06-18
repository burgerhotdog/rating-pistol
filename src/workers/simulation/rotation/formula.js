import { getAttr } from '@/utils';

export const getFormulaConfig = (gameId) => {
  switch(gameId) {
    case 'genshin-impact':
      return {
        ENEMY_RES: 0.1,
        getDefMult: (defRed, defIgn) => 190 / (200 * ((1 - defRed) * (1 - defIgn)) + 190),
      };
    case 'honkai-star-rail':
      return {
        ENEMY_RES: 0,
        getDefMult: (defRed, defIgn) => 100 / (110 * (Math.max(0, 1 - defRed - defIgn)) + 100),
      };
    case 'wuthering-waves':
      return {
        ENEMY_RES: 0.1,
        getDefMult: (defRed, defIgn) => 1520 / (1592 * ((1 - defRed) * (1 - defIgn)) + 1520),
      };
    case 'zenless-zone-zero':
      return {
        ENEMY_RES: -0.2,
        getDefMult: (defRed, defIgn, pen) => 60 / (Math.max(0, 794 * (1 - defRed) * (1 - defIgn) - pen) + 60),
      };
  }
};

const computeBase = (compressed, statMap) => {
  const percentMv = statMap.PERCENT_MV ?? 0;
  const flatMv = statMap.FLAT_MV ?? 0;
  let totalMvPart = 0;

  for (const attr in compressed.mv) {
    const attrValue = getAttr(attr, statMap);
    const mv = compressed.mv[attr] ?? 0;

    totalMvPart += attrValue * (mv + flatMv * compressed.hitCount);
  }

  return totalMvPart * (1 + percentMv) + compressed.flat;
};

// Resistance and defence reduction multipliers applied to final damage.
// Uses the game's standard resistance brackets and the character-level def formula.
const computeReductions = (config, statMap, element, enemyStatMap) => {
  const { ENEMY_RES, getDefMult } = config;

  const resIgnore = (statMap[`IGNORE_${element}_RES`] ?? 0) + (enemyStatMap[`SHRED_${element}_RES`] ?? 0);
  const totalRes = ENEMY_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  const defRed = enemyStatMap['SHRED_DEF'] ?? 0;
  const defIgn = statMap['IGNORE_DEF'] ?? 0;
  const pen = statMap['FLAT_PEN'] ?? 0;
  const defMult = getDefMult(defRed, defIgn, pen);

  return resMult * defMult;
};

const computeBonuses = (statMap, considered, element, enemyStatMap) => {
  const critRate = Math.max(Math.min(getAttr('CR', statMap), 1), 0);
  const critDamage = getAttr('CD', statMap);
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  const dmgTypes = [...considered, ...(element ? [element]: [])];
  let dmgBonusMult = 1 + (statMap['PERCENT_ALL'] ?? 0) + (enemyStatMap['PERCENT_ALL'] ?? 0);
  let ampMult = 1 + (statMap['AMP_ALL'] ?? 0) + (enemyStatMap['AMP_ALL'] ?? 0);

  for (const type of dmgTypes) {
    dmgBonusMult += (statMap[`PERCENT_${type}`] ?? 0) + (enemyStatMap[`PERCENT_${type}`] ?? 0);
    ampMult += (statMap[`AMP_${type}`] ?? 0) + (enemyStatMap[`AMP_${type}`] ?? 0);
  }

  return critMult * dmgBonusMult * ampMult;
};

export const damageFormula = (action, config, statMap) => {
  const { considered, compressed } = action;
  const { enemyStatMap } = config;
  const timesRepeat = action.times * config.repeatCount;
  let sum = 0;

  for (const element in action.compressed) {
    const base = computeBase(compressed[element], statMap) * timesRepeat;

    switch (action.type) {
      case 'damage': {
        const bonuses = computeBonuses(statMap, considered, element, enemyStatMap);
        const reductions = computeReductions(config, statMap, element, enemyStatMap);

        sum += base * bonuses * reductions;
        break;
      }

      case 'healing': {
        const healingBonus = 1 + getAttr('HB', statMap);
        const healingReceived = 1 + getAttr('HR', statMap);

        sum += base * healingBonus * healingReceived;
        break;
      }

      case 'shield': {
        const shieldBonus = 1 + getAttr('SB', statMap);

        sum += base * shieldBonus;
        break;
      }
    }
  }

  return sum;
};
