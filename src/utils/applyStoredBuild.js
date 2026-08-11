import { SET } from '@/data';
import { getDefaultWeaponRank } from '@/utils';

function getSetCounts(gameId, equipList) {
  const setData = SET[gameId];
  const setCounts = {};

  for (const equip of equipList) {
    if (!equip) continue;

    const { setId } = equip;
    if (!setId) continue;
    
    setCounts[setId] = (setCounts[setId] ?? 0) + 1;
  }

  const resolved = {};

  for (const [setId, count] of Object.entries(setCounts)) {
    const { bonuses = [] } = setData[setId];

    for (const tier of bonuses) {
      if (tier > count) continue;
      resolved[setId] = tier;
    }
  }

  return resolved;
}

export function applyStoredBuild(gameId, member, storedBuild) {
  const next = { ...member, build: storedBuild, useUserBuild: true };

  if ('rank' in storedBuild) {
    next.rank = storedBuild.rank;
  }

  if ('weaponId' in storedBuild) {
    next.weaponId = storedBuild.weaponId;
    next.weaponRank = storedBuild.weaponRank ?? getDefaultWeaponRank(gameId, storedBuild.weaponId);
  }

  if ('equipList' in storedBuild) {
    next.setCounts = getSetCounts(gameId, storedBuild.equipList);
  }

  if ('mainEcho' in storedBuild) {
    next.mainEcho = storedBuild.mainEcho;
  }

  if ('resonanceMode' in storedBuild) {
    next.resonanceMode = storedBuild.resonanceMode;
  }

  return next;
}
