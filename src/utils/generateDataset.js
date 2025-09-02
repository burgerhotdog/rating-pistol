import { INFO_DATA, STAT_DATA } from '@data';

const ITERATIONS = 10000;

const WW_ATKDEF = {
  _ATK: [30, 40, 50, 60],
  _DEF: [40, 50, 60, 70],
};

const WW_CRIT = {
  CR: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  CD: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
};

const WW_OTHER = {
  _HP: [320, 360, 390, 430, 470, 510, 540, 580],
  HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ATK: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  ER: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  BA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  HA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  RS: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  RL: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};

const drawLottery = (chances) => {
  const total = chances.reduce((acc, chance) => acc + chance, 0);
  let draw = Math.random() * total;
  for (let i = 0; i < chances.length; i++) {
    draw -= chances[i];
    if (draw < 0) return i;
  }
};

const randomQuality = (gameId, stat) => {
  if (gameId === 'zzz') return 1;
  if (gameId === 'hsr') {
    const options = [1, 0.9, 0.8];
    return options[Math.floor(Math.random() * 3)];
  }
  if (gameId === 'gi') {
    const options = [1, 0.9, 0.8, 0.7];
    return options[Math.floor(Math.random() * 4)];
  }
  const { subValue } = STAT_DATA[gameId][stat];
  if (stat === '_ATK' || stat === '_DEF') {
    const winnerIndex = drawLottery([4, 19, 14, 1]);
    return WW_ATKDEF[stat][winnerIndex] / subValue;
  }
  if (stat === 'CR' || stat === 'CD') {
    const winnerIndex = drawLottery([6, 6, 6, 2, 2, 2, 1, 1]);
    return WW_CRIT[stat][winnerIndex] / subValue;
  }
  const winnerIndex = drawLottery([2, 2, 7, 8, 6, 5, 2, 1]);
  return WW_OTHER[stat][winnerIndex] / subValue;
};

export default (gameId, fullWeights, mainstat) => {
  const scores = new Array(ITERATIONS).fill(0);
  const startingPool = Object.entries(STAT_DATA[gameId])
    .filter(([stat, { subValue }]) => {
      if (!subValue) return false; // remove non-substats
      return gameId === 'ww' || stat !== mainstat;
    })
    .map(([stat, { subChance }]) => [stat, subChance]);

  for (let i = 0; i < ITERATIONS; i++) {
    let substats = [];

    // add initial substats
    let statPool = [...startingPool];
    for (let j = 0; j < INFO_DATA[gameId].NUM_SUBSTATS; j++) {
      const winnerIndex = drawLottery(statPool.map(item => item[1]));
      const [stat] = statPool[winnerIndex];
      substats.push({ stat, rolls: randomQuality(gameId, stat) });
      statPool.splice(winnerIndex, 1);
    }

    // add additional rolls
    if (gameId !== 'ww') {
      // 1 in 5 artifacts gets an extra roll
      const upgradeCount = Math.random() < 0.2 ? 5 : 4;
      for (let j = 0; j < upgradeCount; j++) {
        const lineIndex = Math.floor(Math.random() * 4);
        const { stat } = substats[lineIndex];
        substats[lineIndex].rolls += randomQuality(gameId, stat);
      }
    }

    // multiply rolls by weights and sum all lines
    scores[i] = substats.reduce((acc, { stat, rolls }) => {
      return acc + rolls * (fullWeights[stat] ?? 0);
    }, 0);
  }
  return scores.sort((a, b) => a - b);
};
