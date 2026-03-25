import { CHARACTER_LOOKUP, WEAPON_LOOKUP, GENERAL_LOOKUP } from '@/lookups';
import { combineEquipStats } from '@/utils';

export function buildSourceMapList(gameId, charId, build, buffs = {}) {
  return [
    GENERAL_LOOKUP[gameId].DEFAULT_STATS,
    CHARACTER_LOOKUP[gameId][charId].FIXED_STATS ?? {},
    WEAPON_LOOKUP[gameId][build.weaponId].FIXED_STATS ?? {},
    combineEquipStats(build.equipList),
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
};
