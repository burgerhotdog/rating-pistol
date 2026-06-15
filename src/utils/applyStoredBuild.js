import { getSetCounts } from '@/utils/getSetCounts';
import { getDefaultWeaponRank } from '@/utils/getDefaultRanks';

export function applyStoredBuild(gameId, member, storedBuild) {
  const next = { ...member, build: storedBuild, useUserBuild: true };

  if (storedBuild.rank != null) {
    next.rank = storedBuild.rank;
  }

  if (storedBuild.weaponId) {
    next.weaponId = storedBuild.weaponId;
    next.weaponRank = storedBuild.weaponRank ?? getDefaultWeaponRank(gameId, storedBuild.weaponId);
  }

  if (storedBuild.equipList) {
    next.setCounts = getSetCounts(storedBuild.equipList);
  }

  return next;
}
