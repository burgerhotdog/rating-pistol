import { CHARACTER } from '@/data';
import { formatRotation } from '@/utils/formatRotation';
import { getDefaultCharacterRank, getDefaultWeaponRank } from '@/utils/getDefaultRanks';

export function getMember(gameId, characterId) {
  const data = CHARACTER[gameId][characterId];
  if (!data) throw new Error(`Character "${characterId}" doesn't exist in game "${gameId}"`);

  const weaponId = data.defaults?.weaponId ?? null;

  return {
    memberId: characterId,
    rank: getDefaultCharacterRank(gameId, characterId),
    weaponId,
    weaponRank: weaponId ? getDefaultWeaponRank(gameId, weaponId) : null,
    setCounts: data.defaults?.setCounts ?? {},
    rotation: formatRotation(characterId, data.defaults?.rotation ?? []),
    useUserBuild: false,
  };
}
