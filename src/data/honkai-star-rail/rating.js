import { computeTotalStat, compileStatMap } from '@/utils';

const CHARACTER_LEVEL = 80;
const ENEMY_LEVEL = 90;
const BASE_RES = 0.2;

export function computeBase(statMap, calcs) {
  const { ability, element } = calcs.type;

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

  // Flat damage
  const allFlat = statMap["ADD_ALL"] ?? 0;
  const abilityFlat = statMap[`ADD_${ability}`] ?? 0;
  const elementFlat = statMap[`ADD_${element}`] ?? 0;
  const flatDmg = allFlat + abilityFlat + elementFlat;

  return abilityBaseDmg * baseDmgMult + flatDmg;
}

export function computeBonuses(statMap, calcs) {
  const { ability, element, status } = calcs.type;

  // Crit
  const canCrit = status !== "DOT" && status !== "BREAK";
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap);
  const critMult = canCrit ? (critRate * (1 + critDamage) + (1 - critRate)) : 1;

  // Damage bonus
  const allDmgBonus = computeTotalStat("ALL", statMap);
  const abilityDmgBonus = computeTotalStat(ability, statMap);
  const elementDmgBonus = computeTotalStat(element, statMap);
  const statusDmgBonus = status ? computeTotalStat(status, statMap) : 0;
  const dmgBonusMult = 1 + allDmgBonus + abilityDmgBonus + elementDmgBonus + statusDmgBonus;

  // Vulnerability
  const allVuln = statMap["VULN_ALL"] ?? 0;
  const elementVuln = statMap[`VULN_${element}`] ?? 0;
  const statusVuln = statMap[`VULN_${status}`] ?? 0;
  const vulnMult = 1 + allVuln + elementVuln + statusVuln;

  return critMult * dmgBonusMult * vulnMult;
}

export function computeReductions(statMap, calcs) {
  const { element } = calcs.type;

  // Enemy resistance
  const allShred = statMap[`SHRED_ALL`] ?? 0;
  const elementShred = statMap[`SHRED_${element}`] ?? 0;
  const resMult = 1 - (BASE_RES - (allShred + elementShred));

  // Enemy defense
  const defShred = statMap["SHRED_DEF"] ?? 0;
  const defIgnore = statMap["IGNORE_DEF"] ?? 0;
  const defMult = (CHARACTER_LEVEL + 20) / ((ENEMY_LEVEL + 20) * Math.max(0, 1 - defShred - defIgnore) + CHARACTER_LEVEL + 20);

  // Weakness broken
  const brokenMult = 0.9;

  return resMult * defMult * brokenMult;
}

export function computeDamage(characterId, build, calcs, team) {
  const statMap = compileStatMap("honkai-star-rail", characterId, build, team, "combat");

  const baseDmg = computeBase(statMap, calcs);
  const bonuses = computeBonuses(statMap, calcs);
  const reductions = computeReductions(statMap, calcs);
  return baseDmg * bonuses * reductions;
}
