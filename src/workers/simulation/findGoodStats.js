import { WW } from '@/data';
import { mergeObj, getTotals } from '@/utils';
import { HOYO_MAINSTAT_WEIGHTS } from './statWeights';
import { HOYO_MAINSTAT_VALUES, KURO_MAINSTAT_VALUES, SUBSTAT_VALUES } from './statValues';

const findGoodMainStatsKuro = (baseMap, baseScore, runRotation, getPenalty) => {
  const goodMainStats = {};

  for (const [cost, mainStats] of Object.entries(KURO_MAINSTAT_VALUES)) {
    const preferred = [];

    for (const [statId, value] of Object.entries(mainStats)) {
      const testMap = mergeObj(baseMap, { [statId]: value });
      const testSummary = runRotation(testMap);
      const testTotals = getTotals(testSummary);
      const testScore = (testTotals.damage + testTotals.healing + testTotals.shield) * getPenalty(testMap);

      if (testScore > baseScore) {
        preferred.push(statId);
      }
    }

    if (!preferred.length) {
      goodMainStats[cost] = Object.keys(mainStats);
    } else {
      goodMainStats[cost] = preferred;
    }
  }

  return goodMainStats;
};

const findGoodMainStatsHoyo = (gameId, baseMap, baseScore, runRotation, getPenalty) => {
  const goodMainStats = [];

  for (const mainStats of HOYO_MAINSTAT_WEIGHTS[gameId]) {
    const preferred = [];

    for (const statId of Object.keys(mainStats)) {
      const value = HOYO_MAINSTAT_VALUES[gameId][statId];
      const testMap = mergeObj(baseMap, { [statId]: value });
      const testSummary = runRotation(testMap);
      const testTotals = getTotals(testSummary);
      const testScore = (testTotals.damage + testTotals.healing + testTotals.shield) * getPenalty(testMap);

      if (testScore > baseScore) {
        preferred.push(statId);
      }
    }

    if (!preferred.length) {
      goodMainStats.push(Object.keys(mainStats));
    } else {
      goodMainStats.push(preferred);
    }
  }

  return goodMainStats;
};

const findGoodSubStats = (gameId, baseMap, baseScore, runRotation, getPenalty) => {
  const goodSubStats = [];

  for (const [statId, value] of Object.entries(SUBSTAT_VALUES[gameId])) {
    const testMap = mergeObj(baseMap, { [statId]: value });
    const testSummary = runRotation(testMap);
    const testTotals = getTotals(testSummary);
    const testScore = (testTotals.damage + testTotals.healing + testTotals.shield) * getPenalty(testMap);

    if (testScore > baseScore) {
      goodSubStats.push(statId);
    }
  }

  if (!goodSubStats.length) return Object.keys(SUBSTAT_VALUES[gameId]);
  return goodSubStats;
};

export const findGoodStats = (cache, baseScore, currId, runRotation, getPenalty) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];

  const main = gameId === WW
    ? findGoodMainStatsKuro(baseMap, baseScore, runRotation, getPenalty)
    : findGoodMainStatsHoyo(gameId, baseMap, baseScore, runRotation, getPenalty);

  const sub = findGoodSubStats(gameId, baseMap, baseScore, runRotation, getPenalty);

  return { main, sub };
};
