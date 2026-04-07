import { computeTotalStat } from "@/utils";

const CHARACTER_LEVEL = 80;
const ENEMY_LEVEL = 90;
const AVERAGE_RES = 0.2;

export function computeDamage(statMap, criteria) {
  const dmgTypeElement = criteria.type.element;
  const dmgTypeSkill = criteria.type.ability;
  const isDot = criteria.type.isDot;

  // Base DMG:
  // Character's total stat * skill scaling + flat number
  const multiplier = criteria.scaling.multiplier ?? {};
  const baseDmgScaling = Object.entries(multiplier).reduce((acc, [stat, coeff]) => {
    const totalStat = computeTotalStat(stat, statMap);
    return acc + totalStat * coeff;
  }, 0);
  const baseDmgFlat = criteria.scaling.flat ?? 0;
  const baseDmg = baseDmgScaling + baseDmgFlat;

  // Base DMG Multiplier:
  // Direct multiplier on character talents
  const totalSkillBaseDmg = statMap[`RAW_${dmgTypeSkill}`] ?? 0;
  const baseDmgMultiplier = 1 + totalSkillBaseDmg;

  // Flat Damage Bonus:
  // Teammate buffs, Direct multiplier on some talents
  const totalAddElement = statMap[`ADD_${dmgTypeElement}`] ?? 0;
  const totalAddSkillType = statMap[`ADD_${dmgTypeSkill}`] ?? 0;
  const totalAddAll = statMap["ADD_ALL"] ?? 0;
  const flatDmgBonus = totalAddElement + totalAddSkillType + totalAddAll;

  // Crit multiplier
  const totalCR = Math.min(computeTotalStat("CR", statMap), 1);
  const totalCD = computeTotalStat("CD", statMap);
  const critMult = totalCR * (1 + totalCD) + (1 - totalCR);

  // Damage bonus:
  // Ascension stat, Goblet, Teammate buffs
  const totalElementDmgBonus = computeTotalStat(dmgTypeElement, statMap);
  const totalSkillTypeDmgBonus = computeTotalStat(dmgTypeSkill, statMap);
  const totalAllDmgBonus = computeTotalStat("ALL", statMap);
  const dmgBonus = 1 + totalElementDmgBonus + totalSkillTypeDmgBonus + totalAllDmgBonus;

  // Vulnerability
  const totalElementVuln = computeTotalStat(`VULN_${dmgTypeElement}`, statMap);
  const totalAllVuln = computeTotalStat("VULN_ALL", statMap);
  const totalDoTVuln = computeTotalStat("VULN_DOT", statMap);
  const vulnerabilityMultiplier = 1 + totalElementVuln + totalAllVuln + (isDot ? totalDoTVuln : 0);

  // Defense
  // Def shred can come from teammate buffs
  const totalDefShred = statMap["SHRED_DEF"] ?? 0;
  const totalDefIgnore = statMap["IGNORE_DEF"] ?? 0;
  const defMultiplier = (CHARACTER_LEVEL + 20) / ((ENEMY_LEVEL + 20) * Math.max(0, 1 - totalDefShred - totalDefIgnore) + CHARACTER_LEVEL + 20);

  // Resistance
  // Res shred can come from teammate buffs
  const totalElementResShred = statMap[`SHRED_${dmgTypeElement}`] ?? 0;
  const totalAllResShred = statMap[`SHRED_ALL`] ?? 0;
  const resDebuffs = totalElementResShred + totalAllResShred;
  const resMultiplier = 1 - (AVERAGE_RES - resDebuffs);

  // Broken
  const brokenMultiplier = 0.9;

  return (baseDmg * baseDmgMultiplier + flatDmgBonus) *
    (isDot || isBreak ? 1 : critMult) *
    dmgBonus *
    vulnerabilityMultiplier *
    defMultiplier * resMultiplier * brokenMultiplier;
}