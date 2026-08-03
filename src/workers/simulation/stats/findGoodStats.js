import { WW, MAINSTAT, SUBSTAT } from '@/data';
import { toMergedObj } from '@/utils';
import { getScore } from '../utils';

const findGoodMainStatsWuwa = (baseMap, baseScore, currId, runRotation, getPenalty) => {
  const goodMainStats = {};

  for (const [cost, costMainstats] of Object.entries(MAINSTAT[WW])) {
    const preferred = [];

    for (const { id: statId, value } of Object.values(costMainstats)) {
      const testMap = toMergedObj(baseMap, { [statId]: value });
      const testSummary = runRotation(testMap);
      const testPenalty = getPenalty(testMap);
      const testScore = getScore(testSummary, currId, testPenalty);
      if (testScore > baseScore) preferred.push(statId);
    }

    goodMainStats[cost] = preferred.length ? preferred : Object.keys(costMainstats);
  }

  return goodMainStats;
};

const findGoodMainStatsHoyo = (gameId, baseMap, baseScore, currId, runRotation, getPenalty) => {
  const goodMainStats = [];

  for (const slotMainstats of MAINSTAT[gameId]) {
    const preferred = [];

    for (const { id: statId, value } of Object.values(slotMainstats)) {
      const testMap = toMergedObj(baseMap, { [statId]: value });
      const testSummary = runRotation(testMap);
      const testPenalty = getPenalty(testMap);
      const testScore = getScore(testSummary, currId, testPenalty);
      if (testScore > baseScore) preferred.push(statId);
    }

    goodMainStats.push(preferred.length ? preferred : Object.keys(slotMainstats));
  }

  return goodMainStats;
};

const findGoodSubs = (gameId, baseMap, baseScore, currId, runRotation, getPenalty) => {
  const goodSubStats = [];

  for (const { id: statId, value } of Object.values(SUBSTAT[gameId])) {
    const testMap = toMergedObj(baseMap, { [statId]: value });
    const testSummary = runRotation(testMap);
    const testPenalty = getPenalty(testMap);
    const testScore = getScore(testSummary, currId, testPenalty);
    if (testScore > baseScore) goodSubStats.push(statId);
  }

  return goodSubStats.length
    ? goodSubStats
    : Object.keys(SUBSTAT[gameId]);
};

export const findGoodStats = (cache, baseScore, currId, runRotation, getPenalty) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];

  const main = gameId === WW
    ? findGoodMainStatsWuwa(baseMap, baseScore, currId, runRotation, getPenalty)
    : findGoodMainStatsHoyo(gameId, baseMap, baseScore, currId, runRotation, getPenalty);

  const sub = findGoodSubs(gameId, baseMap, baseScore, currId, runRotation, getPenalty);

  return { main, sub };
};
