import { GENERAL_LOOKUP } from '@/lookups';
import { weightedLottery } from '@/utils';

export function createArtifact(gameId) {
  const { MAIN_STAT_TYPES } = GENERAL_LOOKUP[gameId];

  // Determine slot
  const slotIndex = Math.floor(Math.random() * MAIN_STAT_TYPES.length);

  // Determine main stat
  const weightsList = Object.values(MAIN_STAT_TYPES[slotIndex]).map(({ WEIGHT }) => WEIGHT);
  const winningIndex = weightedLottery(weightsList);
  const mainStatId = Object.keys(MAIN_STAT_TYPES[slotIndex])[winningIndex];

  return [slotIndex, mainStatId];
};
