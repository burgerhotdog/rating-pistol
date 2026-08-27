import { WW, MAINSTAT, MISC } from '@/data';
import { randomInt } from '../math';
import { weightedLottery } from './weightedLottery';

const MAINSTAT_SUB = {
  4: { mainstatSubId: 'atk', mainstatSubValue: 150 },
  3: { mainstatSubId: 'atk', mainstatSubValue: 100 },
  1: { mainstatSubId: 'hp', mainstatSubValue: 2280 },
};

function randomMainstatKey(gameId) {
  if (gameId === WW) {
    const i = randomInt(0, 2);
    return {
      keyId: 'cost',
      keyValue: (i === 0) ? 4 : (i === 1) ? 3 : 1,
    };
  }

  const { maxEquips } = MISC[gameId];
  return {
    keyId: 'index',
    keyValue: randomInt(0, maxEquips - 1),
  };
}

export function randomMainstat(gameId) {
  const { keyId, keyValue } = randomMainstatKey(gameId);

  const mainstatDataList = Object.values(MAINSTAT[gameId][keyValue]);
  const weights = mainstatDataList.map((mainstatData) => mainstatData.weight);

  const winnerIndex = weightedLottery(weights);
  const { id: mainstatId, value: mainstatValue} = mainstatDataList[winnerIndex];

  return {
    keyId,
    keyValue,
    mainstat: {
      mainstatId,
      mainstatValue,
      ...(gameId === WW && MAINSTAT_SUB[keyValue]),
    },
  };
}
