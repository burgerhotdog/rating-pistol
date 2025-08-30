import { AVATAR_DATA, INFO_DATA, STAT_DATA } from '@data';
import { randomQuality } from '@utils';

const ITERATIONS = 10000;

export default (gameId, avatarId, baseStats, mainstat) => {
  const { weights } = AVATAR_DATA[gameId][avatarId];
  const { NUM_SUBSTATS } = INFO_DATA[gameId];
  const scores = new Array(ITERATIONS).fill(0);

  // create substat pool
  const startingPool = Object.entries(STAT_DATA[gameId])
    .filter(([stat, { subValue }]) => {
      if (!subValue) return false; // remove non-substats
      if (gameId === 'ww') return true; // wuwa subs can match mainstat
      return stat !== mainstat;
    })
    .map(([stat, { lotteryChance }]) => [stat, lotteryChance]);

  // iteration loop
  for (let i = 0; i < ITERATIONS; i++) {
    let statPool = [...startingPool];

    // picking initial substats
    let substats = [];
    for (let j = 0; j < NUM_SUBSTATS; j++) {
      // create weighted lottery and select winner
      const lottery = statPool.reduce((acc, [, chance]) => acc + chance, 0);
      const winner = Math.floor(Math.random() * lottery) + 1;

      // find winner
      let count = 0;
      for (let k = 0; k < statPool.length; k++) {
        const [stat, chance] = statPool[k];
        count += chance;
        if (count >= winner) {
          // add substat roll
          substats.push({ stat, rolls: randomQuality(gameId, stat) });
          statPool.splice(k, 1);
          break;
        }
      }
    }

    // adding additional rolls
    if (gameId !== 'ww') {
      // 1 in 5 artifacts gets an extra roll
      const upgradeCount = !Math.floor(Math.random() * 5) ? 5 : 4;
      for (let j = 0; j < upgradeCount; j++) {
        const line = Math.floor(Math.random() * 4);
        const { stat } = substats[line];
        substats[line].rolls += randomQuality(gameId, stat);
      }
    }

    // multiply rolls by weights and sum all lines
    scores[i] = substats.reduce((total, { stat, rolls }) => {
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
  }
  return scores.sort((a, b) => a - b);
};
