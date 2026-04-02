import { computeRating, simulateBuildAfterWeek, getSetCounts, getSetEffects } from '@/utils';

export function multiWeekSimulation(gameId, charId, build, criteria, buffs = {}) {
  const { weaponId, equipList } = build;

  const setCounts = getSetCounts(equipList);
  const setEffects = getSetEffects(setCounts, gameId);
  const buffsWithSet = [buffs, setEffects].reduce((acc, effectMap) => {
    for (const [statId, statValue] of Object.entries(effectMap)) {
      acc[statId] = (acc[statId] ?? 0) + statValue;
    }
    return acc;
  }, {});

  let iter = { weaponId, equipList: Array(equipList.length).fill(null) };
  let weeklyRating = [computeRating(gameId, charId, iter, criteria, buffsWithSet)];

  for (let i = 0; i < 20; i++) {
    iter = simulateBuildAfterWeek(gameId, charId, build, iter, criteria, buffsWithSet);
    weeklyRating.push(computeRating(gameId, charId, iter, criteria, buffsWithSet));
  }

  return { build: iter, weeklyRating };
}
