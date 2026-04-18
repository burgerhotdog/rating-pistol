import { computeTotalStat, compileStatMap } from "@/utils";
import { CHARACTERS } from "@/data"; 

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

export function computeBonuses(statMap, dmgType = []) {
  // Crit
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  // Damage bonus and amp
  let dmgBonusMult = 1 + computeTotalStat("ALL", statMap);
  let ampMult = 1 + (statMap["AMP_ALL"] ?? 0);

  for (const type of dmgType) {
    dmgBonusMult += computeTotalStat(type, statMap);
    ampMult += statMap[`AMP_${type}`] ?? 0;
  }

  return critMult * dmgBonusMult * ampMult;
}

export function computeReductions(statMap, element, dmgType) {
  // Enemy resistance
  let elementShred = statMap[`IGNORE_${element}`] ?? 0
  for (const type of dmgType) {
    elementShred += statMap[`IGNORE_${element}_${type}`] ?? 0;
  }
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
  let defIgnore = statMap["IGNORE_DEF"] ?? 0;
  for (const type of dmgType) {
    defIgnore += statMap[`IGNORE_DEF_${type}`] ?? 0;
  }
  const defMult = (800 + 8 * CHARACTER_LEVEL) / (800 + 8 * CHARACTER_LEVEL + enemyDef * (1 - defIgnore))

  return resMult * defMult;
}

export function computeDamage(characterId, build, calcs, team) {
  const element = CHARACTERS["wuthering-waves"][characterId];
  const statMap = compileStatMap("wuthering-waves", characterId, build, team, "combat");

  let damage = 0;
  for (const ability of calcs.rotation) {
    const { dmgType, hits, times = 1 } = ability;

    const baseDmg = computeBase(statMap, hits);
    const bonuses = computeBonuses(statMap, dmgType);
    const reductions = computeReductions(statMap, element, dmgType);

    damage += baseDmg * bonuses * reductions * times;
  }

  return damage;
}
