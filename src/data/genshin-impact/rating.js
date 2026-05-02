import { computeTotalStat, compileStatMap } from '@/utils';
import { CHARACTERS } from '@/data'; 

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const BASE_RES = 0.1;

export function computeBase(statMap, hits, dmgType = []) {
  const totalEm = computeTotalStat("EM", statMap);
  
  // Base ability Multiplier:
  const baseDmgMult = 1 + (statMap[`RAW_${dmgType[1]}`] ?? 0);

  let baseDamage = 0;
  for (const hit of hits) {
    const { attr = "ATK", mv, times = 1, reaction } = hit;

    // Flat damage bonuses
    let flatDamage = statMap["ADD_ALL"] ?? 0;
    for (const type of dmgType) {
      flatDamage += statMap[`ADD_${type}`] ?? 0;
    }
    if ((reaction === "AGGRAVATE") || (reaction === "SPREAD")) {
      const rxnBonus = reaction === "AGGRAVATE" ? 1.15 : 1.25;
      const totalRxnBonus = statMap[`RXN_${reaction}`] ?? 0;
      const emBonus = (5 * totalEm) / (totalEm + 1200);
      flatDamage += rxnBonus * CHARACTER_LEVEL * (1 + emBonus + totalRxnBonus);
    }

    // Amplifying reactions
    let ampRxnMult = 1;
    if ((reaction === "MELT") || (reaction === "VAPORIZE") || (reaction === "RMELT") || (reaction === "RVAPORIZE")) {
      const rxnBonus = (reaction === "MELT" || reaction === "VAPORIZE") ? 2 : 1.5;
      const totalRxnBonus = statMap[`RXN_${reaction}`] ?? 0;
      const emBonus = 2.78 * (totalEm / (totalEm + 1400));
      ampRxnMult += rxnBonus * (1 + emBonus + totalRxnBonus);
    }

    baseDamage += (computeTotalStat(attr, statMap) * mv * baseDmgMult + flatDamage) * ampRxnMult * times;
  }

  return baseDamage;
}

export function computeBonuses(statMap, dmgType) {
  // Crit
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap);
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  // Damage bonus
  let dmgBonusMult = 1 + computeTotalStat("ALL", statMap);

  for (const type of dmgType) {
    dmgBonusMult += computeTotalStat(type, statMap);
  }

  return critMult * dmgBonusMult;
}

export function computeReductions(statMap, element) {
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
