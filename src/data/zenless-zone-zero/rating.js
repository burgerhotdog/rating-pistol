import { computeTotalStat, compileStatMap } from "@/utils";

const CHARACTER_LEVEL = 60;
const ENEMY_LEVEL = 70;
const BASE_RES = 0.1;

export function computeBase(statMap, calcs) {
  const { ability, element, reaction } = calcs.type;

  // Base ability
  const multiplier = calcs.scaling.multiplier ?? {};
  const multiplierComponent = Object.entries(multiplier).reduce((acc, [stat, motionValue]) => {
    const totalStat = computeTotalStat(stat, statMap);
    return acc + totalStat * motionValue;
  }, 0);
  const flatComponent = calcs.scaling.flat ?? 0;
  const abilityBaseDmg = multiplierComponent + flatComponent;

  // Base ability Multiplier:
  const abilityRawMult = statMap[`RAW_${ability}`] ?? 0;
  const baseDmgMult = 1 + abilityRawMult;

  return abilityBaseDmg * baseDmgMult;
}

export function computeBonuses(statMap, calcs) {
  const { ability, element, reaction } = calcs.type;

  // Crit
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap);
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  // Damage bonus
  const allDmgBonus = computeTotalStat("ALL", statMap);
  const abilityDmgBonus = computeTotalStat(ability, statMap);
  const elementDmgBonus = computeTotalStat(element, statMap);
  const dmgBonusMult = 1 + allDmgBonus + abilityDmgBonus + elementDmgBonus;

  return critMult * dmgBonusMult;
}

export function computeReductions(statMap, calcs) {
  const { element } = calcs.type;

  // Enemy resistance
  const allShred = statMap[`SHRED_ALL`] ?? 0;
  const elementShred = statMap[`SHRED_${element}`] ?? 0;
  const totalRes = BASE_RES - (allShred + elementShred);
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.75) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (4 * totalRes + 1);
  }

  // Enemy defense
  const defShred = statMap["SHRED_DEF"] ?? 0;
  const defIgnore = statMap["IGNORE_DEF"] ?? 0;
  const k = (1 - defShred) * (1 - defIgnore);
  const defMult = (CHARACTER_LEVEL + 100) / (k * (ENEMY_LEVEL + 100) + (CHARACTER_LEVEL + 100));

  return resMult * defMult;
}

export function computeDamage(characterId, build, calcs, team) {
  const statMap = compileStatMap("zenless-zone-zero", characterId, build, team, "combat");

  const baseDmg = computeBase(statMap, calcs);
  const bonuses = computeBonuses(statMap, calcs);
  const reductions = computeReductions(statMap, calcs);
  return baseDmg * bonuses * reductions;
}
