import { GI, HSR, WW, ZZZ, MAINSTAT, SUBSTAT } from '@/data';
import { weightedLottery } from './weightedLottery';

const FLATS_BY_COST = {
  4: { mainstatSubId: 'atk', mainstatSubValue: 150 },
  3: { mainstatSubId: 'atk', mainstatSubValue: 100 },
  1: { mainstatSubId: 'hp', mainstatSubValue: 2280 },
};

function createInitEquip(gameId) {
  switch (gameId) {
    case GI:
      return function initEquip() {
        const index = Math.floor(Math.random() * 5);
        return { index };
      };
    case HSR:
      return function initEquip(spec) {
        const index = spec === 'relic'
          ? Math.floor(Math.random() * 4)
          : Math.random() < 0.5 ? 4 : 5;
        return { index };
      };
    case WW:
      return function initEquip(spec) {
        const cost = spec ?? (Math.random() < 0.5 ? 3 : 1);
        return { cost, ...FLATS_BY_COST[cost] };
      };
    case ZZZ:
      return function initEquip() {
        const index = Math.floor(Math.random() * 6);
        return { index };
      };
  }
}

function createAssignMainstat(keyType, mainData) {
  return function assignMainstat(equip) {
    const key = equip[keyType];
    const mainstats = mainData[key];

    const weights = Object.values(mainstats)
      .map(({ weight }) => weight);

    const winnerIndex = weightedLottery(weights);
    const [id, { value }] = Object.entries(mainstats)[winnerIndex];

    equip.mainstatId = id;
    equip.mainstatValue = value;
  };
}

function createCheckMainstat(keyType, skippableMainstats) {
  return function hasBadMainstat(equip) {
    const key = equip[keyType];
    const skippableSet = skippableMainstats[key];
    return skippableSet.has(equip.mainstatId);
  };
}

function revealSubStatWuwa(substats) {
  const existingStatIds = substats.map((line) => line.id);
  const statPool = Object.values(SUBSTAT[WW])
    .filter(({ id }) => !existingStatIds.includes(id));

  const randomIndex = Math.floor(Math.random() * statPool.length);
  const { id, rollWeights, rollValues } = statPool[randomIndex];

  const index = weightedLottery(rollWeights);
  substats.push({
    id,
    value: rollValues[index],
  });
}

const randomRoll = (gameId, statId) => {
  const numMults = gameId === GI ? 4 : 3;
  const maxValue = SUBSTAT[gameId][statId].value;
  if (gameId === ZZZ) return maxValue;

  const mult = 1 - (Math.floor(Math.random() * numMults) / 10);
  return maxValue * mult;
};

function revealSubStatsHoyo(substats, gameId, mainstatId) {
  const statPool = Object.values(SUBSTAT[gameId])
    .filter(({ id }) => id !== mainstatId);

  for (let i = 0; i < 4; i++) {
    const winnerIndex = weightedLottery(statPool.map(({ weight }) => weight));
    const { id } = statPool[winnerIndex];

    substats.push({ id, value: randomRoll(gameId, id) });
    statPool.splice(winnerIndex, 1);
  }
}

function upgradeSubStats(substats, gameId) {
  const upgradeTimes = Math.random() < 0.2 ? 5 : 4;

  for (let i = 0; i < upgradeTimes; i++) {
    const upgradeIndex = Math.floor(Math.random() * 4);
    const prev = substats[upgradeIndex];

    substats[upgradeIndex] = {
      id: prev.id,
      value: prev.value + randomRoll(gameId, prev.id),
    };
  }
}

export function createEquipGenerator(gameId, skippable) {
  const initEquip = createInitEquip(gameId);

  const keyType = gameId === WW ? 'cost' : 'index';
  const mainData = MAINSTAT[gameId];
  const assignMainstat = createAssignMainstat(keyType, mainData);
  const hasBadMainstat = createCheckMainstat(keyType, skippable.mainstats);

  function hasGoodSubs(substats, numGood) {
    let count = 0;

    for (const { id } of substats) {
      if (!skippable.substats.has(id)) count++;
    }

    return count >= numGood;
  }

  return function generateEquip(spec) {
    const equip = initEquip(spec); // New obj with key
    if (Math.random() < 0.5) return; // Simplified: Return early if wrong set
    assignMainstat(equip);
    if (hasBadMainstat(equip)) return; // Skip if bad mainstat

    const substats = [];
    if (gameId === WW) {
      revealSubStatWuwa(substats);
      if (!hasGoodSubs(substats, 1)) return; // Sub 1 is bad

      revealSubStatWuwa(substats);
      revealSubStatWuwa(substats);
      if (!hasGoodSubs(substats, 2)) return; // Sub 2 and 3 are both bad

      revealSubStatWuwa(substats);
      revealSubStatWuwa(substats);
    } else {
      revealSubStatsHoyo(substats, gameId, equip.mainstatId);
      if (!hasGoodSubs(substats, 2)) return; // Bad starting 4 stats

      upgradeSubStats(substats, gameId);
    }

    return { ...equip, substats };
  };
}
