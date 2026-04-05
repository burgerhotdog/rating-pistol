import { computeTotalStat } from "@/utils";

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const AVERAGE_RES = 0.1;

export function computeDamage(statMap, criteria) {
  const dmgTypeElement = criteria.type.element;
  const dmgTypeSkill = criteria.type.skill;
  const dmgTypeReaction = criteria.type.reaction;
  const totalEm = computeTotalStat("EM", statMap);
  const totalRxnBonus = statMap[`RXN_${dmgTypeReaction}`] ?? 0;

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
  // Catalyze reactions: Spread/Aggravate
  let additiveReactionBonus = 0;
  if (dmgTypeReaction === "AGGRAVATE") additiveReactionBonus = 1.15;
  if (dmgTypeReaction === "SPREAD") additiveReactionBonus = 1.25;
  const emBonusCatalyze = (5 * totalEm) / (totalEm + 1200);
  const flatReactionBonus = additiveReactionBonus * CHARACTER_LEVEL * (1 + emBonusCatalyze + totalRxnBonus);

  // Teammate buffs, Direct multiplier on some talents
  const totalAddElement = statMap[`ADD_${dmgTypeElement}`] ?? 0;
  const totalAddSkillType = statMap[`ADD_${dmgTypeSkill}`] ?? 0;
  const totalAddAll = statMap["ADD_ALL"] ?? 0;
  const flatDamageBuffs = totalAddElement + totalAddSkillType + totalAddAll;

  const flatDmgBonus = flatReactionBonus + flatDamageBuffs;

  // Damage bonus:
  // Ascension stat, Goblet, Teammate buffs
  const totalElementDmgBonus = computeTotalStat(dmgTypeElement, statMap);
  const totalSkillTypeDmgBonus = computeTotalStat(dmgTypeSkill, statMap);
  const totalAllDmgBonus = computeTotalStat("ALL", statMap);
  const dmgBonus = 1 + totalElementDmgBonus + totalSkillTypeDmgBonus + totalAllDmgBonus;

  // Defense
  // Def shred can come from teammate buffs
  const totalDefShred = statMap["SHRED_DEF"] ?? 0;
  const totalDefIgnore = statMap["IGNORE_DEF"] ?? 0;
  const k = (1 - totalDefShred) * (1 - totalDefIgnore);
  const defMult = (CHARACTER_LEVEL + 100) / (k * (ENEMY_LEVEL + 100) + (CHARACTER_LEVEL + 100));

  // Resistance
  // Res shred can come from teammate buffs
  const totalElementResShred = statMap[`SHRED_${dmgTypeElement}`] ?? 0;
  const totalAllResShred = statMap[`SHRED_ALL`] ?? 0;
  const resDebuffs = totalElementResShred + totalAllResShred;
  const resAmount = AVERAGE_RES - resDebuffs;
  const resMult = resAmount < 0
    ? (1 - (resAmount / 2))
    : resAmount < 0.75
      ? (1 - resAmount)
      : (1 / (4 * resAmount + 1));

  // Amplifying Reactions
  let amplifyingReactionBonus = 0;
  const isAmp = ["MELT", "VAPE", "RMELT", "RVAPE"].includes(dmgTypeReaction);
  if (dmgTypeReaction === "MELT" || dmgTypeReaction === "VAPE") amplifyingReactionBonus = 2;
  if (dmgTypeReaction === "RMELT" || dmgTypeReaction === "RVAPE") amplifyingReactionBonus = 1.5;
  const emBonusAmplifying = 2.78 * (totalEm / (totalEm + 1400));
  const ampMult = isAmp ? amplifyingReactionBonus * (1 + emBonusAmplifying + totalRxnBonus) : 1;

  // Crit multiplier
  const totalCR = Math.min(computeTotalStat("CR", statMap), 1);
  const totalCD = computeTotalStat("CD", statMap);
  const critMult = totalCR * (1 + totalCD) + (1 - totalCR);

  return (baseDmg * baseDmgMultiplier + flatDmgBonus) * dmgBonus * defMult * resMult * ampMult * critMult;
}