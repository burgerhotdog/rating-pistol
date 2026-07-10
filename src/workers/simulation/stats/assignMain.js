import { GI, HSR, WW, ZZZ } from '@/data';
import { weightedLottery } from '../utils';
import { HOYO_MAINSTAT_WEIGHTS, WUWA_MAINSTAT_WEIGHTS } from './weights';
import { HOYO_MAINSTAT_VALUES, WUWA_MAINSTAT_VALUES } from './values';

const FLATS_BY_COST = {
  4: {
    mainStatFlatId: 'atk',
    mainStatFlatValue: 150,
  },
  3: {
    mainStatFlatId: 'atk',
    mainStatFlatValue: 100,
  },
  1: {
    mainStatFlatId: 'hp',
    mainStatFlatValue: 2280,
  },
};

export const createAssignMain = (gameId) => {
  const initCost = (spec) => {
    const cost = spec ?? (Math.random() < 0.5 ? 3 : 1);
    return { cost, ...FLATS_BY_COST[cost] };
  };

  const initIndex = (result, spec) => {
    switch (gameId) {
      case GI:
        return {
          index: Math.floor(Math.random() * 5),
        };
      case HSR:
        return {
          index: spec === 'relic'
            ? Math.floor(Math.random() * 4)
            : Math.random() < 0.5 ? 4 : 5
        };
      case ZZZ:
        return {
          index: Math.floor(Math.random() * 6),
        };
    }
  };

  const getWeights = (result) =>
    gameId === WW
      ? WUWA_MAINSTAT_WEIGHTS[result.cost]
      : HOYO_MAINSTAT_WEIGHTS[gameId][result.index];
  
  const getValues = (result) =>
    gameId === WW
      ? WUWA_MAINSTAT_VALUES[result.cost]
      : HOYO_MAINSTAT_VALUES[gameId];

  return (spec) => {
    // Assign cost or index
    const result = gameId === WW
      ? initCost(spec)
      : initIndex(spec);

    // Assign stat
    const weights = getWeights(result);
    const values = getValues(result);
    const winner = weightedLottery(Object.values(weights));

    result.mainStatId = Object.keys(weights)[winner];
    result.mainStatValue = values[result.mainStatId];

    return result;
  };
};
