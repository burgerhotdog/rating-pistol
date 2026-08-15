import { CHARACTER } from '@/data';
import { getDefaultCharRank, getDefaultWeapRank } from './getDefault';

export function getPresetSetCounts(gameId, charId, presetIndex = 0) {
  const preset = CHARACTER[gameId][charId].presets?.[presetIndex] ?? {};
  return preset.setCounts ?? {};
}

export function getMemberPreset(gameId, charId, presetIndex = 0) {
  const character = CHARACTER[gameId][charId];
  const { presets = [] } = character;
  const preset = presets[presetIndex];
  if (!preset) return { id: charId };

  const member = {
    useUserBuild: false,
    id: charId,
    rank: getDefaultCharRank(gameId, charId),
    rotation: [],
  };

  if ('weaponId' in preset) {
    member.weaponId = preset.weaponId;
    member.weaponRank = getDefaultWeapRank(gameId, member.weaponId);
  }

  if ('setCounts' in preset) {
    member.setCounts = preset.setCounts;
  }

  if ('mainEcho' in preset) {
    member.mainEcho = preset.mainEcho;
  }

  if ('rotation' in preset) {
    member.rotation.push(...preset.rotation);
  }

  if ('duration' in preset) {
    member.duration = preset.duration;
  }

  if ('modes' in character) member.mode = character.modes[0];

  return member;
}
