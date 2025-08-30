import { AVATAR_DATA, STAT_DATA } from '@data';

export default (gameId, avatarId, baseStats, statList) => {
  // ensure avatar has weights
  const { weights } = AVATAR_DATA[gameId][avatarId];
  if (!weights) return null;

  return statList.reduce((total, { stat, value }) => {
    // ensure stat and value have values
    if (!stat || !value) return total;

    // check if stat is a flat stat and convert it to a percent stat
    const isFlat = stat[0] === '_';
    const pStat = isFlat ? stat.slice(1) : stat;

    // ensure percent stat has a weight
    const weight = weights[pStat];
    if (!weight) return total;

    // convert flat value to percent value if needed
    const pValue = isFlat ? value / baseStats[stat] * 100 : value;

    // calculate rolls
    const { subValue } = STAT_DATA[gameId][pStat];
    return total + pValue / subValue * weight;
  }, 0);
};
