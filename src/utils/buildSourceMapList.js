import { CHARACTERS, WEAPONS, STATS } from '@/lookups';
import { combineEquipStats, getSetCounts, getSetEffects } from '@/utils';

export function buildSourceMapList(gameId, charId, build, buffs = {}) {
  const setCounts = getSetCounts(build.equipList);
  const setEffects = getSetEffects(setCounts, gameId);
  return [
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][charId].FIXED_STATS ?? {},
    WEAPONS[gameId][build.weaponId].FIXED_STATS ?? {},
    combineEquipStats(build.equipList),
    setEffects,
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
}
