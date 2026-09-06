import { WW, CHARACTER, SET, MISC } from '@/data';
import { getDefaultCharRank, getDefaultWeapRank } from '../getDefault';

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

export function initMember(gameId, memberId, build, overrides) {
  const member = {
    id: null,
    rank: null,
    weaponId: null,
    weaponRank: null,
    setCounts: {},
    ...(gameId === WW && { mainEcho: null }),
    rotation: [],
    duration: null,
  };

  const charData = CHARACTER[gameId][memberId];
  if (!charData) return member;

  if (build) {
    member.build = build;
    if (build.equipList) {
      member.equipList = build.equipList;
    }
  }

  const preset = charData.memberPreset ?? {};

  member.id = Number(memberId);
  member.rank = Number(
    build?.rank ??
    getDefaultCharRank(gameId, member.id)
  );

  const weaponId =
    build?.weaponId ??
    overrides?.weaponId ??
    preset.weaponId;

  if (weaponId) {
    member.weaponId = Number(weaponId);
    member.weaponRank = Number(
      build?.weaponRank ??
      getDefaultWeapRank(gameId, member.weaponId)
    );
  }

  member.setCounts = build?.equipList
    ? buildSetCounts(gameId, build.equipList)
    : { ...(overrides?.setCounts ?? preset.setCounts ?? {}) };

  if (gameId === WW) {
    const mainEcho =
      build?.equipList?.[0]?.echoId ??
      overrides?.mainEcho ??
      preset.mainEcho;

    if (mainEcho) {
      member.mainEcho = Number(mainEcho);
    }
  }

  member.skillLevels = {
    ...Object.fromEntries(
      MISC[gameId].skillIds
        .map((skillId) => [skillId, MISC[gameId].maxSkillLevel])
    ),
    ...(build?.skillLevels ?? {}),
  };

  member.rotation = [...(preset.rotation ?? [])];
  member.duration = preset.duration ?? null;

  if (gameId === WW && charData.modes) {
    member.mode =
      build?.mode ??
      overrides?.mode ??
      charData.modes[0];
  }

  return member;
}
