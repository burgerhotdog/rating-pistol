import { GI, WW, ZZZ, SUBSTAT } from '@/data';
import { randomInt, randomMainstat } from '@/utils';
import { weightedLottery } from './weightedLottery';

function revealSubstatsWW(substats, count) {
  const prevStats = new Set(substats.map(({ id }) => id));

  const statPool = Object.values(SUBSTAT[WW])
    .filter(({ stat }) => !prevStats.has(stat));

  for (let i = 0; i < count; i++) {
    const statIndex = randomInt(0, statPool.length - 1);
    const { stat, rollWeights, rollValues } = statPool[statIndex];

    const rollIndex = weightedLottery(rollWeights);
    const roll = rollValues[rollIndex];

    substats.push({ id: stat, value: roll });
    statPool.splice(statIndex, 1);
  }
}

const randomRoll = (gameId, stat) => {
  const { value } = SUBSTAT[gameId][stat];

  if (gameId === ZZZ) {
    return value;
  }

  const numMults = gameId === GI ? 4 : 3;
  const mult = 1 - (Math.floor(Math.random() * numMults) / 10);
  return value * mult;
};

function revealSubstats(substats, gameId, mainstatId) {
  const statPool = Object.values(SUBSTAT[gameId]).filter(({ stat }) => stat !== mainstatId);

  for (let i = 0; i < 4; i++) {
    const weights = statPool.map(({ weight }) => weight);
    const statIndex = weightedLottery(weights);
    const { stat } = statPool[statIndex];
    const roll = randomRoll(gameId, stat);

    substats.push({ id: stat, value: roll });
    statPool.splice(statIndex, 1);
  }
}

export function createEquipGenerator(skippable) {
  const skipSubstats = skippable.substats;

  const canSkip = (substats) =>
    substats.reduce((acc, { id }) => acc + !skipSubstats.has(id), 0) < 2;

  return (gameId) => {
    const isSetMatch = Math.random() < 0.5;
    if (gameId !== GI && !isSetMatch) return;

    const { keyId, keyValue, mainstat } = randomMainstat(gameId);
    if (gameId === GI && (!isSetMatch && keyValue !== 3)) return;
    if (skippable.mainstats[keyValue].has(mainstat.mainstatId)) return;

    const substats = [];
    if (gameId === WW) {
      revealSubstatsWW(substats, 3);
      if (canSkip(substats)) return; // Sub 2 and 3 are both bad

      revealSubstatsWW(substats, 2);
    } else {
      revealSubstats(substats, gameId, mainstat.mainstatId);
      if (canSkip(substats)) return; // Bad starting 4 stats
      
      const upgradeTimes = Math.random() < 0.2 ? 5 : 4;
      for (let i = 0; i < upgradeTimes; i++) {
        const upgradeIndex = randomInt(0, 3);
        const substat = substats[upgradeIndex];

        substat.value += randomRoll(gameId, substat.id);
      }
    }

    return { [keyId]: keyValue, ...mainstat, substats };
  };
}
