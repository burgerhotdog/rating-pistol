import { CHARACTERS, WEAPONS, MISC } from '@/data';
import { mergeEquipList, mergeStatMaps } from '@/utils';

export function compileStatMap(gameId, characterId, build) {
  const { weaponId, equipList = [], statMap } = build;

  return mergeStatMaps(
    MISC[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][characterId].stats,
    WEAPONS[gameId][weaponId]?.stats ?? {},
    statMap ?? mergeEquipList(equipList)
  );
}
