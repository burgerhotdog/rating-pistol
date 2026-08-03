import { GI, WW, ZZZ, SUBSTAT } from '@/data';
import { weightedLottery } from '../utils';

export function revealSubStatWuwa(subStatList) {
  const existingStatIds = subStatList.map((line) => line.subStatId);
  const statPool = Object.values(SUBSTAT[WW])
    .filter(({ id }) => !existingStatIds.includes(id));

  const randomIndex = Math.floor(Math.random() * statPool.length);
  const { id, rollWeights, rollValues } = statPool[randomIndex];

  const index = weightedLottery(rollWeights);
  subStatList.push({
    subStatId: id,
    subStatValue: rollValues[index],
  });
}

const randomRoll = (gameId, statId) => {
  const numMults = gameId === GI ? 4 : 3;
  const maxValue = SUBSTAT[gameId][statId].value;
  if (gameId === ZZZ) return maxValue;

  const mult = 1 - (Math.floor(Math.random() * numMults) / 10);
  return maxValue * mult;
};

export function revealSubStatsHoyo(subStatList, gameId, mainStatId) {
  const statPool = Object.values(SUBSTAT[gameId])
    .filter(({ id }) => id !== mainStatId);

  for (let i = 0; i < 4; i++) {
    const winnerIndex = weightedLottery(statPool.map(({ weight }) => weight));
    const { id: subStatId } = statPool[winnerIndex];

    subStatList.push({ subStatId, subStatValue: randomRoll(gameId, subStatId) });
    statPool.splice(winnerIndex, 1);
  }
}

export function upgradeSubStats(subStatList, gameId) {
  const upgradeTimes = Math.random() < 0.2 ? 5 : 4;

  for (let i = 0; i < upgradeTimes; i++) {
    const upgradeIndex = Math.floor(Math.random() * 4);
    const prev = subStatList[upgradeIndex];

    subStatList[upgradeIndex] = {
      subStatId: prev.subStatId,
      subStatValue: prev.subStatValue + randomRoll(gameId, prev.subStatId),
    };
  }
}
