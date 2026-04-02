import { CHARACTERS, WEAPONS, STATS } from '@/data';
import { combineEquipStats, getSetCounts, getSetEffects } from '@/utils';

export function buildSourceMapList(gameId, charId, build, buffs = {}) {
  const setCounts = getSetCounts(build.equipList);
  const setEffects = getSetEffects(setCounts, gameId);
  return [
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][charId].fixedStats ?? {},
    WEAPONS[gameId][build.weaponId].fixedStats ?? {},
    combineEquipStats(build.equipList),
    setEffects,
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
}
