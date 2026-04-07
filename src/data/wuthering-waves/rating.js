import { computeTotalStat } from "@/utils";

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const BASE_RES = 0.1;

function computeBase(statMap, criteria) {
  // Base ability
  const multiplier = criteria.scaling.multiplier ?? {};
  const multiplierComponent = Object.entries(multiplier).reduce((acc, [stat, motionValue]) => {
    const totalStat = computeTotalStat(stat, statMap);
    return acc + totalStat * motionValue;
  }, 0);
  const flatComponent = criteria.scaling.flat ?? 0;
  const abilityBaseDmg = multiplierComponent + flatComponent;

  // Flat
  const flatDamage = 0;

  return abilityBaseDmg + flatDamage;
}

function computeBonuses(statMap, criteria) {
  const { ability, element, status } = criteria.type;

  // Crit
  const critRate = Math.min(computeTotalStat("CR", statMap), 1);
  const critDamage = computeTotalStat("CD", statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  // Damage bonus
  const allDmgBonus = computeTotalStat("ALL", statMap);
  const abilityDmgBonus = ability ? computeTotalStat(ability, statMap) : 0;
  const elementDmgBonus = element ? computeTotalStat(element, statMap) : 0;
  const statusDmgBonus = status ? computeTotalStat(status, statMap) : 0;
  const dmgBonusMult = 1 + allDmgBonus + abilityDmgBonus + elementDmgBonus + statusDmgBonus;

  // Amplification
  const allAmp = statMap["AMP_ALL"] ?? 0;
  const abilityAmp = statMap[`AMP_${ability}`] ?? 0;
  const elementAmp = statMap[`AMP_${element}`] ?? 0;
  const statusAmp = statMap[`AMP_${status}`] ?? 0;
  const ampMult = 1 + allAmp + abilityAmp + elementAmp + statusAmp;

  return critMult * dmgBonusMult * ampMult;
}

function computeReductions(statMap, criteria) {
  const { element } = criteria.type;

  // Enemy resistance
  const elementResShred = statMap[`SHRED_${element}`] ?? 0
  const totalRes = BASE_RES - elementResShred;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  // Enemy defense
  const enemyDef = 8 * ENEMY_LEVEL + 792;
  const defIgnore = statMap["IGNORE_DEF"] ?? 0;
  const defMult = (800 + 8 * CHARACTER_LEVEL) / (800 + 8 * CHARACTER_LEVEL + enemyDef * (1 - defIgnore))

  return resMult * defMult;
}

export function computeDamage(statMap, criteria) {
  const base = computeBase(statMap, criteria);
  const bonuses = computeBonuses(statMap, criteria);
  const reductions = computeReductions(statMap, criteria);

  return base * bonuses * reductions;
}