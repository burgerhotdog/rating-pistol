import { simulateArtifactProgression, combineEquipStats } from '@/utils';

const ITERATIONS = 100;

self.onmessage = ({ data: { gameId, buildEntry, buffs, criteriaIndex } }) => {
  const rawData = [];
  for (let i = 0; i < ITERATIONS; i++) {
    rawData.push(simulateArtifactProgression(gameId, buildEntry, buffs, criteriaIndex));
  }

  // Average weekly ratings
  const weeklyRatings = [];
  for (let week = 0; week < 21; week++) {
    weeklyRatings.push(rawData.reduce((acc, run) => acc + run.weeklyDamages[week], 0) / ITERATIONS);
  }

  // Average final week equip stats
  const finalStats = {};
  for (let i = 0; i < ITERATIONS; i++) {
    const finalCombined = combineEquipStats(rawData[i].finalBuild.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat];
    }
  }

  for (const stat in finalStats) {
    finalStats[stat] /= ITERATIONS;
  }

  self.postMessage({ weeklyRatings, finalStats });
};
