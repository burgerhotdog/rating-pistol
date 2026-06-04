import { CHARACTER, WEAPON, MISC } from '@/data';
import { mergeEquipList, mergeStatMaps } from '@/utils';

export function compileStatMap(gameId, characterId, build) {
  const { weaponId, equipList = [], statMap } = build;

  return mergeStatMaps(
    MISC[gameId].DEFAULT_STATS,
    CHARACTER[gameId][characterId].stats,
    WEAPON[gameId][weaponId]?.stats ?? {},
    statMap ?? mergeEquipList(equipList)
  );
}
