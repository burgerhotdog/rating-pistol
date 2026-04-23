import { computeTotalStat, compileStatMap, mergeStatMaps } from "@/utils";
import { CHARACTERS, MVS } from "@/data";

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const BASE_RES = 0.1;

export function computeBase(statMap, attr, multipliers) {
  let baseDamage = 0;
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  for (const part of multipliers) {
    const { times = 1 } = part;
    const mv = Array.isArray(part.mv) ? part.mv[9] : part.mv;
    baseDamage += computeTotalStat(attr, statMap) * ((mv + flatMv) * (1 + percentMv)) * times;
  }
  return baseDamage;
}

export function computeBonuses(statMap, element, dmgType) {
  // Crit multiplier
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  // Damage bonus and amp
  let dmgBonusMult = 1 + computeTotalStat("ALL", statMap);
  let ampMult = 1 + (statMap["AMP_ALL"] ?? 0);

  for (const type of [element, ...dmgType]) {
    dmgBonusMult += computeTotalStat(type, statMap);
    ampMult += statMap[`AMP_${type}`] ?? 0;
  }

  return critMult * dmgBonusMult * ampMult;
}

export function computeReductions(statMap, element, dmgType) {
  // Enemy resistance multiplier
  let resIgnore = statMap[`IGNORE_${element}`] ?? 0
  for (const type of dmgType) {
    resIgnore += statMap[`IGNORE_${element}_${type}`] ?? 0;
  }
  const totalRes = BASE_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  // Enemy defense multiplier
  const enemyDef = 8 * ENEMY_LEVEL + 792;
  let defIgnore = statMap["IGNORE_DEF"] ?? 0;
  for (const type of dmgType) {
    defIgnore += statMap[`IGNORE_DEF_${type}`] ?? 0;
  }
  const defMult = (800 + 8 * CHARACTER_LEVEL) / (800 + 8 * CHARACTER_LEVEL + enemyDef * (1 - defIgnore))

  return resMult * defMult;
}

export function computeDamage(characterId, build, calcs, team) {
  const { element } = CHARACTERS["wuthering-waves"][characterId];
  const statMap = compileStatMap("wuthering-waves", characterId, build, team, "combat");

  let damage = 0;
  for (const step of calcs.rotation) {
    const [skillId, subSkillId] = step.split("-");
    const { dmgType, modifiers, attr = "ATK", multipliers } = MVS["wuthering-waves"][characterId]?.[skillId]?.subSkills?.[subSkillId];
    const adjustedStatMap = modifiers ? mergeStatMaps(statMap, modifiers) : statMap;

    const baseDmg = computeBase(adjustedStatMap, attr, multipliers);
    const bonuses = computeBonuses(adjustedStatMap, element, dmgType);
    const reductions = computeReductions(adjustedStatMap, element, dmgType);

    damage += baseDmg * bonuses * reductions;
  }

  return damage;
}
