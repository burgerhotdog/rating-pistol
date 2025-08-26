import { INFO_DATA, STAT_DATA } from '@data';

export default (gameId, percentile, stat, index) => {
  const times = 10000 / (10000 - percentile * 100);
  const spec_times = times / STAT_DATA[gameId][stat].mainChance[index];
  const chance_for_right_index = gameId === 'hsr'
    ? index < 4 ? 0.25 : 0.5
    : gameId === 'ww'
      ? index === 0 ? 1 : index < 3 ? 0.75 : 0.25
      : 1 / INFO_DATA[gameId].NUM_MAINSTATS;
  const runs = (spec_times * (1 / chance_for_right_index)) / (INFO_DATA[gameId].DROPS_PER_RUN / 2);
  const days = (runs * INFO_DATA[gameId].RESIN_PER_RUN) / INFO_DATA[gameId].RESIN_PER_DAY;
  return days;
};
