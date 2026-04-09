import { CHARACTERS, WEAPONS, STATS } from '@/data';
import { mergeEquipList, getFixedSetBuffs } from '@/utils';

export function buildSourceMapList(gameId, charId, build, buffs = {}) {
  const { fixedMenuSetBuffs: setEffects } = getFixedSetBuffs(gameId, build.equipList);
  return [
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][charId].fixedStats ?? {},
    WEAPONS[gameId][build.weaponId].fixedStats ?? {},
    mergeEquipList(build.equipList),
    setEffects,
    ...(Object.keys(buffs).length ? [buffs] : []),
  ];
}
