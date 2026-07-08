import { WW } from '@/data';
import { mergeObj } from '@/utils';
import { getWeightedScore } from './utils';
import { HOYO_MAINSTAT_WEIGHTS } from './stats/weights';
import { HOYO_MAINSTAT_VALUES, WUWA_MAINSTAT_VALUES, SUBSTAT_VALUES } from './stats/values';

const findGoodMainStatsWuwa = (baseMap, baseScore, currId, runRotation, getPenalty) => {
  const goodMainStats = {};

  for (const [cost, mainStats] of Object.entries(WUWA_MAINSTAT_VALUES)) {
    const preferred = [];

    for (const [statId, value] of Object.entries(mainStats)) {
      const testMap = mergeObj(baseMap, { [statId]: value });
      const testSummary = runRotation(testMap);
      const testPenalty = getPenalty(testMap);
      const testScore = getWeightedScore(testSummary, currId, testPenalty);

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

const findGoodMainStatsHoyo = (gameId, baseMap, baseScore, currId, runRotation, getPenalty) => {
  const goodMainStats = [];

  for (const mainStats of HOYO_MAINSTAT_WEIGHTS[gameId]) {
    const preferred = [];

    for (const statId of Object.keys(mainStats)) {
      const value = HOYO_MAINSTAT_VALUES[gameId][statId];
      const testMap = mergeObj(baseMap, { [statId]: value });
      const testSummary = runRotation(testMap);
      const testPenalty = getPenalty(testMap);
      const testScore = getWeightedScore(testSummary, currId, testPenalty);

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

const findGoodSubs = (substatValues, baseMap, baseScore, currId, runRotation, getPenalty) => {
  const goodSubStats = [];

  for (const [statId, value] of Object.entries(substatValues)) {
    const testMap = mergeObj(baseMap, { [statId]: value });
    const testSummary = runRotation(testMap);
    const testPenalty = getPenalty(testMap);
    const testScore = getWeightedScore(testSummary, currId, testPenalty);

    if (testScore > baseScore) {
      goodSubStats.push(statId);
    }
  }

  return goodSubStats.length
    ? goodSubStats
    : Object.keys(substatValues);
};

export const findGoodStats = (cache, baseScore, currId, runRotation, getPenalty) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];

  const main = gameId === WW
    ? findGoodMainStatsWuwa(baseMap, baseScore, currId, runRotation, getPenalty)
    : findGoodMainStatsHoyo(gameId, baseMap, baseScore, currId, runRotation, getPenalty);

  const substatValues = SUBSTAT_VALUES[gameId];
  const sub = findGoodSubs(substatValues, baseMap, baseScore, currId, runRotation, getPenalty);

  return { main, sub };
};
