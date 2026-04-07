import { computeTotalStat } from "@/utils";

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const AVERAGE_RES = 0.1;

function computeBase(statMap, criteria) {
  // Base ability
  const multiplier = criteria.scaling.multiplier ?? {};
  const multiplierComponent = Object.entries(multiplier).reduce((acc, [stat, motionValue]) => {
    const totalStat = computeTotalStat(stat, statMap);
    return acc + totalStat * motionValue;
  }, 0);
  const flatComponent = criteria.scaling.flat ?? 0;
  const baseAbilityDamage = multiplierComponent + flatComponent;

  // Flat
  const flatDamage = 0;

  return baseAbilityDamage + flatDamage;
}

function computeBonuses(statMap, criteria) {
  const { element, ability, status } = criteria.type;

  // Crit
  const totalCR = Math.min(computeTotalStat("CR", statMap), 1);
  const totalCD = computeTotalStat("CD", statMap) - 1;
  const crit = totalCR * (1 + totalCD) + (1 - totalCR);

  // Damage bonus
  const damageBonusElement = element ? computeTotalStat(element, statMap) : 0;
  const damageBonusSkill = ability ? computeTotalStat(ability, statMap) : 0;
  const damageBonusStatus = status ? computeTotalStat(status, statMap) : 0;
  const damageBonusAll = computeTotalStat("ALL", statMap);
  const damageBonus = 1 + damageBonusElement + damageBonusSkill + damageBonusStatus + damageBonusAll;

  // Amplify
  const ampElement = statMap[`AMP_${element}`] ?? 0;
  const ampSkill = statMap[`AMP_${ability}`] ?? 0;
  const ampStatus = statMap[`AMP_${status}`] ?? 0;
  const ampAll = statMap["AMP_ALL"] ?? 0;
  const amplify = 1 + ampElement + ampSkill + ampStatus + ampAll;

  return crit * damageBonus * amplify;
}

function computeReductions(statMap, criteria) {
  const { element } = criteria.type;

  // Resistance
  const resTotal = AVERAGE_RES - (statMap[`SHRED_${element}`] ?? 0);
  let res;
  if (resTotal < 0) {
    res = 1 - resTotal / 2;
  } else if (resTotal < 0.8) {
    res = 1 - resTotal;
  } else {
    res = 1 / (5 * resTotal + 1);
  }

  // Defense
  const enemyDef = 8 * ENEMY_LEVEL + 792;
  const defIgnore = statMap["IGNORE_DEF"] ?? 0;
  const def = (800 + 8 * CHARACTER_LEVEL) / (800 + 8 * CHARACTER_LEVEL + enemyDef * (1 - defIgnore))

  return res * def;
}

export function computeDamage(statMap, criteria) {
  const base = computeBase(statMap, criteria);
  const bonuses = computeBonuses(statMap, criteria);
  const reductions = computeReductions(statMap, criteria);

  return base * bonuses * reductions;
}