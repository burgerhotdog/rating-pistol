import { CHARACTER, GI, WW, ZZZ } from '@/data';

export function getMvIndexOffset(gameId, memberId, memberRank, skillId) {
  if (gameId === WW) {
    return 0;
  }

  if (gameId === ZZZ) {
    if (memberRank >= 5) {
      return 4;
    }

    if (memberRank >= 3) {
      return 2;
    }

    return 0;
  }

  const { rankModify } = CHARACTER[gameId][memberId].skills[skillId];

  if (!rankModify || memberRank < rankModify) {
    return 0;
  }

  if (gameId === GI) {
    return 3;
  }

  return skillId === 'basicAtk' ? 1 : 2;
}

export function getMvIndex(
  gameId,
  memberId,
  memberRank,
  skillId,
  skillLevel,
) {
  return skillLevel - 1 + getMvIndexOffset(
    gameId,
    memberId,
    memberRank,
    skillId,
  );
}
