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
  const character = CHARACTER[gameId][charId];
  const { quality, presets = [] } = character;
  const preset = presets[presetIndex];
  if (!preset) return { id: charId };

  const member = {
    useUserBuild: false,
    id: charId,
    rank: quality === 5 ? 0 : 6,
    rotation: [],
  };

  if ('weaponId' in preset) {
    member.weaponId = preset.weaponId;
    member.weaponRank = getDefaultWeaponRank(gameId, member.weaponId);
  }

  if ('setCounts' in preset) {
    member.setCounts = preset.setCounts;
  }

  if ('rotation' in preset) {
    member.rotation.push(...preset.rotation);
  }

  if ('modes' in character) member.resonanceMode = character.modes[0];

  return member;
}
