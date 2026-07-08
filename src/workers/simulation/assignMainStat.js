import { GI, HSR, WW } from '@/data';
import { weightedLottery } from './utils';
import { HOYO_MAINSTAT_WEIGHTS, WUWA_MAINSTAT_WEIGHTS } from './stats/weights';
import { HOYO_MAINSTAT_VALUES, WUWA_MAINSTAT_VALUES, WUWA_MAINSTAT_FLATS } from './stats/values';

const assignHoyo = (gameId, index) => {
  const options = HOYO_MAINSTAT_WEIGHTS[gameId][index];
  const winnerIndex = weightedLottery(Object.values(options));
  const mainStatId = Object.keys(options)[winnerIndex];
  const mainStatValue = HOYO_MAINSTAT_VALUES[gameId][mainStatId];

  return { index, mainStatId, mainStatValue };
};

const assignWuwa = (cost) => {
  const weightMap = WUWA_MAINSTAT_WEIGHTS[cost];
  const valueMap = WUWA_MAINSTAT_VALUES[cost];
  const [mainStatFlatId, mainStatFlatValue] = WUWA_MAINSTAT_FLATS[cost];

  const winnerIndex = weightedLottery(Object.values(weightMap));
  const mainStatId = Object.keys(weightMap)[winnerIndex];
  const mainStatValue = valueMap[mainStatId];

  return { cost, mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue };
};

export const assignMainStat = (gameId, spec = {}) => {
  if (gameId === WW) {
    const cost = spec.cost ?? (Math.random() < 0.5 ? 3 : 1);

    return assignWuwa(cost);
  } else {
    if (gameId === HSR) {
      const randomIndex = spec.type === 'relic'
        ? Math.floor(Math.random() * 4)
        : Math.random() < 0.5 ? 4 : 5;

      return assignHoyo(gameId, randomIndex);
    } else {
      const numMainStats = gameId === GI ? 5 : 6;
      const randomIndex = Math.floor(Math.random() * numMainStats);

      return assignHoyo(gameId, randomIndex);
    }
  }
};
