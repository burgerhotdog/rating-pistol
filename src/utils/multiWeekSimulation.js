import { computeRating, simulateBuildAfterWeek } from '@/utils';

export function multiWeekSimulation(gameId, charId, build, criteria, buffs = {}) {
  const { weaponId, equipList } = build;

  let iter = { weaponId, equipList: Array(equipList.length).fill(null) };
  let weeklyRating = [computeRating(gameId, charId, iter, criteria, buffs)];

  for (let i = 0; i < 20; i++) {
    iter = simulateBuildAfterWeek(gameId, charId, iter, criteria, buffs);
    weeklyRating.push(computeRating(gameId, charId, iter, criteria, buffs));
  }

  return { build: iter, weeklyRating };
};
