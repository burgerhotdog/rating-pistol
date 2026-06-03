import { getSetCounts } from '@/utils/getSetCounts';
import { getDefaultCharacterRank, getDefaultWeaponRank } from '@/utils/getDefaultRanks';

/**
 * Returns a new member object with the stored build applied.
 * Pure — does not mutate the incoming member.
 */
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
