import { combineEquipStats, getSetCounts, getSetEffects } from "@/utils";
import { findBenchmarkWeek, createRun, getAverageRatings, advanceRunOneWeek } from "./simulation.helpers"

const MIN_RUNS = 100;
const MAX_RUNS = 1000;
const MAX_WEEKS = 20;
const EPS = 1e-8;

function getStd(list) {
  const n = list.length;
  const mean = list.reduce((a, b) => a + b) / n;
  const sumSquaredDiff = list.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return Math.sqrt(sumSquaredDiff / (n - 1));
}

self.onmessage = ({ data }) => {
  const { gameId, characterId, build, criteria, buffs } = data;
  const setCounts = getSetCounts(build.equipList);
  const setEffects = getSetEffects(setCounts, gameId);
  const buffsWithSet = [buffs, setEffects].reduce((acc, effectMap) => {
    for (const [statId, statValue] of Object.entries(effectMap)) {
      acc[statId] = (acc[statId] ?? 0) + statValue;
    }
    return acc;
  }, {});

  const runs = [];
  let lastBenchmarkWeek = null;
  for (let i = 0; i < MIN_RUNS; i++) {
    runs.push(createRun(gameId, characterId, build, criteria, buffsWithSet));
  }

  for (let week = 1; week <= MAX_WEEKS; week++) {
    // advance all runs by one week
    for (const run of runs) {
      advanceRunOneWeek(run, gameId, characterId, build, criteria, buffsWithSet);
    }

    // if relative error is too high add more runs
    while (runs.length < MAX_RUNS) {
      const values = runs.map(run => run.ratings[week]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = getStd(values);

      const standardError = std / Math.sqrt(values.length);
      const relativeError = standardError / Math.max(Math.abs(mean), EPS);

      if (relativeError <= 0.005) break;

      const run = createRun(gameId, characterId, build, criteria, buffsWithSet);
      for (let w = 1; w <= week; w++) {
        advanceRunOneWeek(run, gameId, characterId, build, criteria, buffsWithSet);
      }
      runs.push(run);
    }
  
    let weeklyRatings = getAverageRatings(runs, week);
    let benchmarkWeek = findBenchmarkWeek(weeklyRatings);

    if (benchmarkWeek !== -1 && benchmarkWeek <= week) {
      lastBenchmarkWeek = benchmarkWeek;
      break;
    }

    self.postMessage({ type: "progress", completed: week });
  }

  console.log(runs.length);

  if (!lastBenchmarkWeek) {
    lastBenchmarkWeek = 20;
  }

  const weeklyRatings = getAverageRatings(runs, lastBenchmarkWeek);

  // Average final week equip stats
  const finalStats = {};
  for (let i = 0; i < runs.length; i++) {
    const finalCombined = combineEquipStats(runs[i].build.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat] / runs.length;
    }
  }

  self.postMessage({ type: "done", completed: lastBenchmarkWeek, weeklyRatings, finalStats });
};
