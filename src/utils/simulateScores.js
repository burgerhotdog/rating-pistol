import { INFO_DATA, STAT_DATA } from '@data';
import { rollStat, calculateScore } from '@utils';

const ITERATIONS = 10000;

export default (gameId, avatarId, weaponId, mainstat) => {
  const scores = new Array(ITERATIONS).fill(0);

  // substat pool
  const startingPool = Object.entries(STAT_DATA[gameId])
    .filter(([stat, { subValue }]) => {
      if (!subValue) return false; // remove non-substats
      if (gameId === 'ww') return true; // wuwa subs can match mainstat
      return stat !== mainstat;
    })
    .map(([stat, { lotteryChance }]) => {
      return [stat, lotteryChance];
    });

  // simulation loop
  for (let i = 0; i < ITERATIONS; i++) {
    let statPool = [...startingPool];

    // adding the substat lines (weighted lottery)
    let substats = [];
    for (let j = 0; j < INFO_DATA[gameId].NUM_SUBSTATS; j++) {
      const totalChance = statPool.reduce((acc, [_, chance]) => (
        acc + chance
      ), 0);

      const random = Math.floor(Math.random() * totalChance) + 1;

      let cumulative = 0;
      for (let k = 0; k < statPool.length; k++) {
        const [stat, chance] = statPool[k];
        cumulative += chance;
        if (random <= cumulative) {
          substats.push({ stat, value: rollStat(gameId, stat) });
          statPool.splice(k, 1);
          break;
        }
      }
    }

    // adding the rest of the rolls
    if (gameId !== 'ww') {
      // 1 in 4 artifacts gets an extra upgrade
      const upgradeCount = !Math.floor(Math.random() * 4) ? 5 : 4;
      for (let j = 0; j < upgradeCount; j++) {
        const random = Math.floor(Math.random() * 4);
        const stat = substats[random].stat;
        substats[random].value += rollStat(gameId, stat);
      }
    }

    scores[i] = calculateScore(gameId, avatarId, weaponId, substats);
  }
  return scores.sort((a, b) => a - b);
};
