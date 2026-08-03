import { GI, HSR, WW, ZZZ, MAINSTAT } from '@/data';
import { weightedLottery } from '../utils';

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

  const gameMainstat = MAINSTAT[gameId];

  return (spec) => {
    // Assign cost or index
    const result = gameId === WW
      ? initCost(spec)
      : initIndex(spec);

    // Assign stat
    const options = gameMainstat[gameId === WW ? result.cost : result.index];
    const winner = weightedLottery(Object.values(options).map(({ weight }) => weight));

    result.mainStatId = Object.keys(options)[winner];
    result.mainStatValue = options[result.mainStatId].value;

    return result;
  };
};
