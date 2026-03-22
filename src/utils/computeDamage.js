import { GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';
import { computeTotalStat, combineEquipStats } from '@/utils';

export function computeDamage(gameId, charId, charBuild) {
  if (!charId || !charBuild) return 0;
  const sourceMapList = [
    GENERAL_LOOKUP[gameId].DEFAULT_STATS ?? {},
    CHARACTER_LOOKUP[gameId][charId].FIXED_STATS ?? {},
    WEAPON_LOOKUP[gameId][charBuild.weaponId].FIXED_STATS ?? {},
    combineEquipStats(charBuild.equipList),
  ];
  const totalATK = computeTotalStat('ATK', sourceMapList).totalValue;
  const totalCR = computeTotalStat('CR', sourceMapList).totalValue;
  const totalCD = computeTotalStat('CD', sourceMapList).totalValue;
  const dmgElement = CHARACTER_LOOKUP[gameId][charId].ELEMENT.toUpperCase();
  const totalELEMENTDMG = computeTotalStat(dmgElement, sourceMapList).totalValue;

  return totalATK * (1 + totalELEMENTDMG) * (totalCR * (1 + totalCD) + (1 - totalCR));
};
