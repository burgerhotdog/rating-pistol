import { MAINSTAT, SUBSTAT } from '@/data';

const findGoodMainStats = (gameId, baseScore, getScore) => {
  const goodMainStats = {};

  for (const [key, options] of Object.entries(MAINSTAT[gameId])) {
    const goodStats = [];

    for (const { id, value } of Object.values(options)) {
      const { score } = getScore({ [id]: value });
      if (score > baseScore) goodStats.push(id);
    }
  
    goodMainStats[key] = goodStats.length ? goodStats : Object.keys(options);
  }

  return goodMainStats;
};

const findGoodSubs = (gameId, baseScore, getScore) => {
  const goodSubStats = [];

  for (const { id: statId, value } of Object.values(SUBSTAT[gameId])) {
    const { score } = getScore({ [statId]: value });
    if (score > baseScore) goodSubStats.push(statId);
  }

  return goodSubStats.length
    ? goodSubStats
    : Object.keys(SUBSTAT[gameId]);
};

export const findGoodStats = (gameId, baseScore, getScore) => {
  return {
    main: findGoodMainStats(gameId, baseScore, getScore),
    sub: findGoodSubs(gameId, baseScore, getScore),
  };
};
