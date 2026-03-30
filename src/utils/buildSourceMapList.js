import { CHARACTERS, WEAPONS, STATS } from '@/lookups';
import { combineEquipStats } from '@/utils';

export function buildSourceMapList(gameId, charId, build, buffs = {}) {
  return [
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][charId].FIXED_STATS ?? {},
    WEAPONS[gameId][build.weaponId].FIXED_STATS ?? {},
    combineEquipStats(build.equipList),
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
}
