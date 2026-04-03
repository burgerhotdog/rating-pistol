import { buildSourceMapList, computeTotalStat } from '@/utils';

export function computeRating(gameId, charId, build, criteria, buffs = {}) {
  const sourceMapList = buildSourceMapList(gameId, charId, build, buffs);

  // Base DMG:
  // Character's total stat * Skill multiplier + flat number
  let baseDmg = criteria.scaling.flat ?? 0;

  const multiplier = criteria.scaling.multiplier ?? {};
  for (const [stat, coeff] of Object.entries(multiplier)) {
    baseDmg += computeTotalStat(stat, sourceMapList) * coeff;
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
  const totalElementDmgBonus = computeTotalStat(dmgElement, sourceMapList);
  // Skill type
  const dmgSkillType = criteria.type.skill;
  const totalSkillTypeDmgBonus = computeTotalStat(dmgSkillType, sourceMapList);
  // All type
  const totalAllTypeDmgBonus = computeTotalStat('ALL', sourceMapList);
  const dmgBonus = 1 + totalElementDmgBonus + totalSkillTypeDmgBonus + totalAllTypeDmgBonus;

  // Amplifying Reactions
  let rxnBonus = 0;
  const totalEm = computeTotalStat("EM", sourceMapList);
  const rxn = criteria.type.reaction;
  if (rxn === "MELT" || rxn === "VAPE") {
    rxnBonus = 2;
  }

  if (rxn === "RMELT" || rxn === "RVAPE") {
    rxnBonus = 1.5;
  }

  const ampMult = rxn ? rxnBonus * (1 + (2.78 * (totalEm / (totalEm + 1400)))) : 1;

  // Crit multiplier
  const totalCR = Math.min(computeTotalStat('CR', sourceMapList), 1);
  const totalCD = computeTotalStat('CD', sourceMapList) - (gameId === 'wuthering-waves' ? 1 : 0);
  const critMult = totalCR * (1 + totalCD) + (1 - totalCR);

  return (baseDmg * baseDmgMultiplier + additiveBaseDmgBonus) * dmgBonus * ampMult * critMult;
}
