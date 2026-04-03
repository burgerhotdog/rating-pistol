import { STATS } from '@/data';
import { weightedLottery } from '@/utils';

const WW_ATKDEF = {
  FLAT_ATK: [30, 40, 50, 60],
  FLAT_DEF: [40, 50, 60, 70],
};

const WW_CRIT = {
  PERCENT_CR: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  PERCENT_CD: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
};

const WW_OTHER = {
  FLAT_HP: [320, 360, 390, 430, 470, 510, 540, 580],
  PERCENT_HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_ATK: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  PERCENT_ER: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  PERCENT_BA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_HA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_RS: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_RL: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};

const randomRoll = (gameId, statId) => {
  const { VALUE } = STATS[gameId].SUB_STAT_TYPES[statId];
  if (gameId === 'zenless-zone-zero') return VALUE;
  if (gameId === 'honkai-star-rail') {
    const options = [1, 0.9, 0.8];
    return options[Math.floor(Math.random() * 3)] * VALUE;
  }
  if (gameId === 'genshin-impact') {
    const options = [1, 0.9, 0.8, 0.7];
    return options[Math.floor(Math.random() * 4)] * VALUE;
  }

  if (statId === 'FLAT_ATK' || statId === 'FLAT_DEF') {
    const winnerIndex = weightedLottery([4, 19, 14, 1]);
    return WW_ATKDEF[statId][winnerIndex];
  }
  if (statId === 'PERCENT_CR' || statId === 'PERCENT_CD') {
    const winnerIndex = weightedLottery([6, 6, 6, 2, 2, 2, 1, 1]);
    return WW_CRIT[statId][winnerIndex] * 0.01;
  }
  const winnerIndex = weightedLottery([2, 2, 7, 8, 6, 5, 2, 1]);
  return WW_OTHER[statId][winnerIndex] * (statId === 'FLAT_HP' ? 1 : 0.01);
};

export function upgradeArtifact(gameId, mainStatId) {
  const { NUM_SUBSTATS, SUB_STAT_TYPES } = STATS[gameId];

  // Create sub stat lines
  const statPool = Object.entries(SUB_STAT_TYPES)
    .filter(([id]) => id !== mainStatId || gameId === 'wuthering-waves')
    .map(([id, { WEIGHT }]) => [id, WEIGHT]);

  let subStatList = [];
  for (let i = 0; i < NUM_SUBSTATS; i++) {
    const winnerIndex = weightedLottery(statPool.map(item => item[1]));
    const [subStatId] = statPool[winnerIndex];
    subStatList.push({ subStatId, subStatValue: randomRoll(gameId, subStatId) });
    statPool.splice(winnerIndex, 1);
  }

  // Add additional rolls
  if (gameId !== 'wuthering-waves') {
    // 1 in 5 artifacts gets an extra roll
    const upgradeCount = Math.random() < 0.2 ? 5 : 4;
    for (let i = 0; i < upgradeCount; i++) {
      const lineIndex = Math.floor(Math.random() * 4);
      const { subStatId } = subStatList[lineIndex];
      subStatList[lineIndex].subStatValue += randomRoll(gameId, subStatId);
    }
  }

  return subStatList;
}
