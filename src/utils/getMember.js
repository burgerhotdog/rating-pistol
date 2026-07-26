import { WW, CHARACTER } from '@/data';
import { getDefaultCharacterRank, getDefaultWeaponRank } from '@/utils';

export function getMember(gameId, charId, presetIndex = 0) {
  const preset = CHARACTER[gameId][charId].presets?.[presetIndex] ?? {};

  const weaponId = preset.weaponId ?? null;

  return {
    id: charId,
    rank: getDefaultCharacterRank(gameId, charId),
    weaponId,
    weaponRank: weaponId ? getDefaultWeaponRank(gameId, weaponId) : null,
    setCounts: preset.setCounts ?? {},
    ...(gameId === WW && { mainEcho: preset.mainEcho }),
    rotation: preset.rotation ?? [],
    useUserBuild: false,
  };
}
