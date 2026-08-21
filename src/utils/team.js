import { CHARACTER } from '@/data';
import { getDefaultCharRank, getDefaultWeapRank } from './getDefault';
import { applyStoredBuild } from './applyStoredBuild';

function getMemberPreset(gameId, charId, presetIndex = 0) {
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

export function initMember(key, gameId, builds) {
  if (!key) return {};

  const [id, index = 0] = key.split('.');

  let member = getMemberPreset(gameId, id, index);
  if (id in builds) {
    member = applyStoredBuild(gameId, member, builds[id]);
  }

  return member;
}
