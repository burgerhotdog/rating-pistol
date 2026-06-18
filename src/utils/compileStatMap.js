import { MISC, CHARACTER, WEAPON } from '@/data';
import { mergeObjs, mergeEquipList } from '@/utils';

export function compileStatMap(gameId, characterId, build) {
  const { weaponId, equipList = [] } = build;

  return mergeObjs(
    MISC[gameId].DEFAULT_STATS,
    CHARACTER[gameId][characterId].stats,
    WEAPON[gameId][weaponId]?.stats ?? {},
    mergeEquipList(equipList)
  );
}
