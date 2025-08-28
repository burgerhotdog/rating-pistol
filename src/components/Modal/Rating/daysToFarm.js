import { INFO_DATA, STAT_DATA } from '@data';

const index_chance = (gameId, index) => {
  if (gameId === 'hsr') {
    if (index < 4) return 0.25; // relic
    return 0.5; // planar
  }

  if (gameId === 'ww') {
    if (index === 0) return 1 // 4-cost
    if (index < 3) return 0.8; // 3-cost
    return 0.2; // 1-cost
  }

  return 1 / INFO_DATA[gameId].NUM_MAINSTATS;
};

export default (gameId, percentile, stat, index) => {
  const times = 10000 / (10000 - percentile * 100);
  const spec_times = times / STAT_DATA[gameId][stat].mainChance[index];
  const runs = (spec_times / index_chance(gameId, index)) / (INFO_DATA[gameId].DROPS_PER_RUN / 2);
  const days = (runs * INFO_DATA[gameId].RESIN_PER_RUN) / INFO_DATA[gameId].RESIN_PER_DAY;
  return days;
};
