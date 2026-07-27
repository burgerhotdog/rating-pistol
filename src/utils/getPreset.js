import { CHARACTER, WEAPON } from '@/data';

export function getDefaultWeaponRank(gameId, weaponId) {
  const { quality } = WEAPON[gameId][weaponId];
  return quality === 5 ? 1 : 5;
}

export function getPresetSetCounts(gameId, charId, presetIndex = 0) {
  const preset = CHARACTER[gameId][charId].presets?.[presetIndex] ?? {};
  return preset.setCounts ?? {};
}

export function getMemberPreset(gameId, charId, presetIndex = 0) {
  const { quality, presets = [] } = CHARACTER[gameId][charId];
  const preset = presets[presetIndex];
  if (!preset) return {};

  const member = {
    useUserBuild: false,
    id: charId,
    rank: quality === 5 ? 0 : 6,
  };

  if ('weaponId' in preset) member.weaponId = preset.weaponId;
  if ('weaponId' in member) member.weaponRank = getDefaultWeaponRank(gameId, member.weaponId);
  if ('setCounts' in preset) member.setCounts = preset.setCounts;
  if ('rotation' in preset) member.rotation = preset.rotation;

  if ('mainEcho' in preset) member.mainEcho = preset.mainEcho;

  return member;
}
