import { getSetCounts, getDefaultWeaponRank } from '@/utils';

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
    next.setCounts = getSetCounts(storedBuild.equipList);
  }

  return next;
}
