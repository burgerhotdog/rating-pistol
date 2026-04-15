import { computeTotalStat, compileStatMap } from "@/utils";

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const BASE_RES = 0.1;

export function computeBase(statMap, hits) {
  let baseDamage = 0;
  for (const hit of hits) {
    const { attr = "ATK", mv, times = 1 } = hit;
    baseDamage += computeTotalStat(attr, statMap) * mv * times;
  }
  return baseDamage;
}

export function computeBonuses(statMap, type) {
  const { ability, element, status } = type;

  // Crit
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
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

export function computeReductions(statMap, type) {
  const { element } = type;

  // Enemy resistance
  const elementShred = statMap[`SHRED_${element}`] ?? 0
  const totalRes = BASE_RES - elementShred;
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

export function computeDamage(characterId, build, calcs, team) {
  const statMap = compileStatMap("wuthering-waves", characterId, build, team, "combat");

  const rotation = calcs.rotation;
  let damage = 0;
  if (!rotation) return 0; // temp
  for (const skill of rotation) {
    const { type, hits, times = 1 } = skill;
    if (!hits) continue; // temp
    const baseDmg = computeBase(statMap, hits);
    const bonuses = computeBonuses(statMap, type);
    const reductions = computeReductions(statMap, type);

    damage += baseDmg * bonuses * reductions * times;
  }

  return damage;
}
