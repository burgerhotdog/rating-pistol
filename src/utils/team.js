import { WW, CHARACTER, SET } from '@/data';
import { getDefaultCharRank, getDefaultWeapRank } from './getDefault';

function buildSetCounts(gameId, equipList) {
  // Tally set ids in equipList
  const setTallys = {};
  for (const equip of equipList) {
    const id = equip?.setId;
    if (!id) continue;
    setTallys[id] = (setTallys[id] ?? 0) + 1;
  }

  // Resolve tally against set bonuses
  const setCounts = {};
  for (const [id, tally] of Object.entries(setTallys)) {
    const bonuses = SET[gameId][id]?.bonuses ?? [];
    for (const bonus of bonuses.sort((a, b) => a - b)) {
      if (bonus > tally) break;
      setCounts[id] = bonus;
    }
  }

  return setCounts;
}

export function initMember(key, gameId, builds) {
  if (!key) return {};
  const [id, index = 0] = key.split('.');
  const character = CHARACTER[gameId][id];
  if (!character) return {};

  const member = { id };
  const build = builds[id];
  if (build) member.build = build;
  const preset = character.presets?.[index];

  member.rank = build?.rank ?? getDefaultCharRank(gameId, id);
  member.weaponId = build?.weaponId ?? preset?.weaponId;
  if (member.weaponId) {
    member.weaponRank = build?.weaponRank ?? getDefaultWeapRank(gameId, member.weaponId);
  }

  member.setCounts = build?.equipList
    ? buildSetCounts(gameId, build.equipList)
    : preset?.setCounts ?? {};

  if (gameId === WW) {
    member.mainEcho = build?.equipList?.[0]?.echoId ?? preset?.mainEcho;
  }

  member.rotation = [...(preset?.rotation ?? [])];
  member.duration = preset?.duration;

  if ('modes' in character) {
    member.mode = build?.mode ?? preset?.mode ?? character.modes[0];
  }

  return member;
}
