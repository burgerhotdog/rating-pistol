import { multiWeekSimulation, combineEquipStats } from '@/utils';

const PROGRESS_EVERY = 1;
const MAX_ITERATIONS = 500;

function runWithConvergence(simulationFunction, threshold = 0.005, windowSize = 50) {
  let results = [];
  let runningSum = 0;
  let simData = [];

  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    const { build, weeklyRating } = simulationFunction();
    simData.push({ build, weeklyRating });

    if (i % PROGRESS_EVERY === 0 || i === MAX_ITERATIONS) {
      self.postMessage({
        type: 'progress',
        completed: i,
      });
    }

    runningSum += weeklyRating[20];
    const currentAvg = runningSum / i;
    results.push(currentAvg);

    // Only check once we have enough data to fill the window
    if (i >= windowSize) {
      const window = results.slice(-windowSize);
      const windowMean = window.reduce((a, b) => a + b) / windowSize;

      // Find the biggest % deviation from the window mean
      const maxDeviation = Math.max(...window.map(v =>
        Math.abs(v - windowMean) / windowMean
      ));

      if (maxDeviation < threshold) {
        console.log(`Converged at iteration ${i}`);
        return simData; // stop early!
      }
    }
  }
  console.log('didnt converge');
  return simData; // hit max, return best guess
}

self.onmessage = ({ data: { gameId, characterId, build, criteria, buffs } }) => {
  const rawData = runWithConvergence(() => multiWeekSimulation(gameId, characterId, build, criteria, buffs));

  // Average weekly ratings
  const weeklyRatings = [];
  for (let week = 0; week < 21; week++) {
    weeklyRatings.push(rawData.reduce((acc, run) => acc + run.weeklyRating[week], 0) / rawData.length);
  }

  // Average final week equip stats
  const finalStats = {};
  for (let i = 0; i < rawData.length; i++) {
    const finalCombined = combineEquipStats(rawData[i].build.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat];
    }
  }

  for (const stat in finalStats) {
    finalStats[stat] /= rawData.length;
  }

  self.postMessage({
    type: 'done',
    weeklyRatings,
    finalStats,
  });
};
