import { CHARACTER } from '@/data';
import { getDefaultCharacterRank, getDefaultWeaponRank } from '@/utils';

export function getMember(gameId, characterId) {
  const charData = CHARACTER[gameId][characterId];
  const { defaults = {} } = charData;

  const weaponId = defaults.weaponId ?? null;

  return {
    id: characterId,
    rank: getDefaultCharacterRank(gameId, characterId),
    weaponId,
    weaponRank: weaponId ? getDefaultWeaponRank(gameId, weaponId) : null,
    setCounts: defaults.setCounts ?? {},
    rotation: defaults.rotation ?? [],
    useUserBuild: false,
  };
}
