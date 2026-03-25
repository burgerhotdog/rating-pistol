import { multiWeekSimulation, combineEquipStats } from '@/utils';

const ITERATIONS = 100;

self.onmessage = ({ data: { gameId, charId, build, criteria, buffs } }) => {
  const rawData = [];
  for (let i = 0; i < ITERATIONS; i++) {
    rawData.push(multiWeekSimulation(gameId, charId, build, criteria, buffs));
  }

  // Average weekly ratings
  const weeklyRatings = [];
  for (let week = 0; week < 21; week++) {
    weeklyRatings.push(rawData.reduce((acc, run) => acc + run.weeklyRating[week], 0) / ITERATIONS);
  }

  // Average final week equip stats
  const finalStats = {};
  for (let i = 0; i < ITERATIONS; i++) {
    const finalCombined = combineEquipStats(rawData[i].build.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat];
    }
  }

  for (const stat in finalStats) {
    finalStats[stat] /= ITERATIONS;
  }

  self.postMessage({ weeklyRatings, finalStats });
};
