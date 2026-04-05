import { CHARACTERS, WEAPONS, STATS } from '@/data';
import { mergeEquipList, getSetCounts, getSetEffects } from '@/utils';

export function buildSourceMapList(gameId, charId, build, buffs = {}) {
  const setCounts = getSetCounts(build.equipList);
  const setEffects = getSetEffects(setCounts, gameId);
  return [
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][charId].fixedStats ?? {},
    WEAPONS[gameId][build.weaponId].fixedStats ?? {},
    mergeEquipList(build.equipList),
    setEffects,
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
}
