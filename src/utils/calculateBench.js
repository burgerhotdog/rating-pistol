import { AVATAR_DATA, INFO_DATA, STAT_DATA } from '@data';
import { lowQuality } from '@utils';

export default (gameId, avatarId, baseStats, mainstat) => {
  const { weights } = AVATAR_DATA[gameId][avatarId];
  const { NUM_SUBSTATS } = INFO_DATA[gameId];

  // create substat pool
  const weightsWithFlats = { ...weights };
  for (const [baseStat, baseValue] of Object.entries(baseStats)) {
    if (baseStat.slice(1) in weightsWithFlats) {
      const subValue = STAT_DATA[gameId][baseStat].subValue;
      const pSubValue = STAT_DATA[gameId][baseStat.slice(1)].subValue
      const valueRatio = subValue / baseValue * 100 / pSubValue;
      weightsWithFlats[baseStat] = valueRatio * weights[baseStat.slice(1)];
    }
  }

  const statPool = Object.entries(weightsWithFlats)
    .filter(([stat]) => {
      if (gameId === 'ww') return true; // wuwa subs can match mainstat
      return stat !== mainstat;
    })
    .sort((a, b) => b[1] - a[1]) // order by weight
    .map(([stat]) => stat);
  
  // picking initial substats
  let substats = [];
  for (let i = 0; i < NUM_SUBSTATS; i++) {
    const stat = statPool[i];
    if (!stat) break;
    substats.push({ stat, rolls: lowQuality(gameId, stat) });
  }

  // adding the rest of the rolls
  if (gameId !== 'ww') {
    for (const line of substats.slice(0, 1)) {
      line.rolls += lowQuality(gameId, line.stat) * 2;
    }
  }

  return substats.reduce((total, { stat, rolls }) => {
    // check if stat is a flat stat and convert it to a percent stat
    const isFlat = stat[0] === '_';
    const pStat = isFlat ? stat.slice(1) : stat;

    // ensure percent stat has a weight
    const weight = weights[pStat];
    if (!weight) return total;

    // convert flat value to percent value if needed
    const subValue = STAT_DATA[gameId][stat].subValue;
    const pSubValue = STAT_DATA[gameId][pStat].subValue
    const valueRatio = subValue / baseStats[stat] * 100 / pSubValue;
    const pRolls = isFlat ? rolls * valueRatio : rolls;
    return total + pRolls * weight;
  }, 0);
};
