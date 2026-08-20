import { SET } from '@/data';
import { getDefaultWeapRank } from '@/utils';

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

export function applyStoredBuild(gameId, member, storedBuild) {
  const next = { ...member, build: storedBuild, useUserBuild: true };

  if ('rank' in storedBuild) {
    next.rank = storedBuild.rank;
  }

  if ('weaponId' in storedBuild) {
    next.weaponId = storedBuild.weaponId;
    next.weaponRank = storedBuild.weaponRank ?? getDefaultWeapRank(gameId, storedBuild.weaponId);
  }

  if ('equipList' in storedBuild) {
    next.setCounts = buildSetCounts(gameId, storedBuild.equipList);
  }

  if ('mainEcho' in storedBuild) {
    next.mainEcho = storedBuild.mainEcho;
  }

  if ('mode' in storedBuild) {
    next.mode = storedBuild.mode;
  }

  return next;
}
