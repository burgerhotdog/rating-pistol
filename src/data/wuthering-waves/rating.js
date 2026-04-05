import { computeTotalStat } from "@/utils";

export function computeDamage(statMap, criteria) {
  // Base DMG:
  // Character's total stat * Skill multiplier + flat number
  let baseDmg = criteria.scaling.flat ?? 0;

  const multiplier = criteria.scaling.multiplier ?? {};
  for (const [stat, coeff] of Object.entries(multiplier)) {
    baseDmg += computeTotalStat(stat, statMap) * coeff;
  }
  // Base DMG Multiplier:
  // Rare multiplier found on some skills
  let baseDmgMultiplier = 1;

  // Additive Base DMG Bonus:
  // Spread/Aggravate, Rare multiplier on skills
  let additiveBaseDmgBonus = 0;

  // Damage bonus:
  // Element
  const dmgElement = criteria.type.element;
  const totalElementDmgBonus = computeTotalStat(dmgElement, statMap);
  // Skill type
  const dmgSkillType = criteria.type.skill;
  const totalSkillTypeDmgBonus = computeTotalStat(dmgSkillType, statMap);
  // All type
  const totalAllTypeDmgBonus = computeTotalStat("ALL", statMap);
  const dmgBonus = 1 + totalElementDmgBonus + totalSkillTypeDmgBonus + totalAllTypeDmgBonus;

  // Crit multiplier
  const totalCR = Math.min(computeTotalStat("CR", statMap), 1);
  const totalCD = computeTotalStat("CD", statMap) - 1;
  const critMult = totalCR * (1 + totalCD) + (1 - totalCR);

  return (baseDmg * baseDmgMultiplier + additiveBaseDmgBonus) * dmgBonus * critMult;
}