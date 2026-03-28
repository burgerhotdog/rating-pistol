import { STATS } from '@/lookups';
import { weightedLottery, upgradeArtifact } from '@/utils';

export function generateArtifact(gameId) {
  const { MAIN_STAT_TYPES } = STATS[gameId];

  // Random set
  const setId = Math.floor(Math.random() * 2);

  // Random slot (wuwa calc is different)
  const slotIndex = gameId === 'wuthering-waves'
    ? Math.floor(Math.random() * (MAIN_STAT_TYPES.length - 1)) + 1
    : Math.floor(Math.random() * MAIN_STAT_TYPES.length);

  // Main stat
  const mainStatOptions = MAIN_STAT_TYPES[slotIndex];
  const mainStatWeights = Object.values(mainStatOptions).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(mainStatOptions)[weightedLottery(mainStatWeights)];
  const mainStatValue = mainStatOptions[mainStatId].VALUE;

  // Sub stat list
  const subStatList = upgradeArtifact(gameId, mainStatId);

  return [slotIndex, { setId, mainStatId, mainStatValue, subStatList }];
}
