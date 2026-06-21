import { SET } from '@/data';
import { getDefaultWeaponRank } from '@/utils';

const getSetCounts = (gameId, equipList) => {
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
    console.log(setCounts);
    const { tieredEffects = {} } = setData[setId];

    for (const tier in tieredEffects) {
      if (Number(tier) > count) continue;

      resolved[setId] = Number(tier);
    }
  }

  return resolved;
};

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

  return next;
}
