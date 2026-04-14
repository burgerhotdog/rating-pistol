import { computeTotalStat, compileStatMap } from "@/utils";

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const BASE_RES = 0.1;

export function computeBase(statMap, scaling, type = {}) {
  const { ability, element, reaction } = type;
  const totalEm = computeTotalStat("EM", statMap);
  const totalRxnBonus = statMap[`RXN_${reaction}`] ?? 0;

  // Base ability
  const multiplier = scaling.multiplier ?? {};
  const multiplierComponent = Object.entries(multiplier).reduce((acc, [stat, motionValue]) => {
    const totalStat = computeTotalStat(stat, statMap);
    return acc + totalStat * motionValue;
  }, 0);
  const flatComponent = scaling.flat ?? 0;
  const abilityBaseDmg = multiplierComponent + flatComponent;

  // Base ability Multiplier:
  const abilityRawMult = statMap[`RAW_${ability}`] ?? 0;
  const baseDmgMult = 1 + abilityRawMult;

  // Flat damage
  // Non reaction
  const allFlat = statMap["ADD_ALL"] ?? 0;
  const abilityFlat = statMap[`ADD_${ability}`] ?? 0;
  const elementFlat = statMap[`ADD_${element}`] ?? 0;
  const nonRxnComponent = allFlat + abilityFlat + elementFlat;
  // Additive reactions
  let rxnBonus = 0;
  if (reaction === "AGGRAVATE") rxnBonus = 1.15;
  if (reaction === "SPREAD") rxnBonus = 1.25;
  const emBonus = (5 * totalEm) / (totalEm + 1200);
  const rxnComponent = rxnBonus * CHARACTER_LEVEL * (1 + emBonus + totalRxnBonus);
  const flatDmg = nonRxnComponent + rxnComponent;

  return abilityBaseDmg * baseDmgMult + flatDmg;
}

export function computeBonuses(statMap, type) {
  const { ability, element, reaction } = type;
  const totalEm = computeTotalStat("EM", statMap);
  const totalRxnBonus = statMap[`RXN_${reaction}`] ?? 0;

  // Crit
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap);
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  // Damage bonus
  const allDmgBonus = computeTotalStat("ALL", statMap);
  const abilityDmgBonus = computeTotalStat(ability, statMap);
  const elementDmgBonus = computeTotalStat(element, statMap);
  const dmgBonusMult = 1 + allDmgBonus + abilityDmgBonus + elementDmgBonus;

  // Amplifying reactions
  let rxnBonus = 0;
  if (reaction === "MELT" || reaction === "VAPORIZE") rxnBonus = 2;
  if (reaction === "RMELT" || reaction === "RVAPORIZE") rxnBonus = 1.5;
  const emBonus = 2.78 * (totalEm / (totalEm + 1400));
  const rxnMult = ["MELT", "VAPORIZE", "RMELT", "RVAPORIZE"].includes(reaction) ? rxnBonus * (1 + emBonus + totalRxnBonus) : 1;

  return critMult * dmgBonusMult * rxnMult;
}

export function computeReductions(statMap, type) {
  const { element } = type;

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
  const statMap = compileStatMap("genshin-impact", characterId, build, team, "combat");

  const combo = calcs.combo;
  let damage = 0;
  if (!combo) return 0;
  for (const hit of combo) {
    const scaling = hit.scaling;
    const type = hit.type;
    const baseDmg = computeBase(statMap, scaling, type);
    const bonuses = computeBonuses(statMap, type);
    const reductions = computeReductions(statMap, type);

    const repeat = hit.repeat;
    damage += baseDmg * bonuses * reductions * (repeat ?? 1);
  }

  return damage;
}
