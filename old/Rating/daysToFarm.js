import { ALL_GENERAL_LOOKUP, ALL_GENERAL_LOOKUP } from '@/lookups';

const index_chance = (gameId, index) => {
  if (gameId === 'honkai-star-rail') {
    if (index < 4) return 0.25; // relic
    return 0.5; // planar
  }

  if (gameId === 'wuthering-waves') {
    if (index === 0) return 1 // 4-cost
    if (index < 3) return 0.8; // 3-cost
    return 0.2; // 1-cost
  }

  return 1 / ALL_GENERAL_LOOKUP[gameId].NUM_MAINSTATS;
};

export default (gameId, percentile, mainStatId, index) => {
  const times = 10000 / (10000 - percentile * 100);
  const spec_times = times / ALL_GENERAL_LOOKUP[gameId].STATS[mainStatId].mainChance[index];
  const runs = (spec_times / index_chance(gameId, index)) / (ALL_GENERAL_LOOKUP[gameId].DROPS_PER_RUN / 2);
  const days = (runs * ALL_GENERAL_LOOKUP[gameId].RESIN_PER_RUN) / ALL_GENERAL_LOOKUP[gameId].RESIN_PER_DAY;
  return days;
};
