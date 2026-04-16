import { mergeEquipList, computeTotalStat, compileStatMap } from "@/utils";
import { findBenchmarkWeek, getAverageScores, findRelativeError } from "./helpers";
import { createTrial } from "./createTrial";
import { advanceTrial } from "./advanceTrial";
import { advanceTrialWuwa } from "./advanceTrialWuwa";
import { findPreferred, findPreferredWuwa } from "./findPreferred";

const MIN_TRIALS = 100;
const MAX_TRIALS = 1000;
const MAX_WEEKS = 20;

self.onmessage = ({ data }) => {
  const { gameId, characterId, build, calcs, team } = data;
  const isWuwa = gameId === "wuthering-waves";
  const setIdList = build.equipList.map(equip => equip?.setId);
  const matchTargets = (calcs.match ?? []).map(stat => {
    return computeTotalStat(stat, compileStatMap(gameId, characterId, build, team, "menu"));
  });
  const trials = [];
  let lastBenchmarkWeek = null;

  // Initialize first week
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial(matchTargets, gameId, characterId, build, calcs, team));
  }

  const preferredMainStats = isWuwa
    ? findPreferredWuwa(trials[0], gameId, characterId, calcs, team, matchTargets)
    : findPreferred(trials[0], gameId, characterId, calcs, team, matchTargets);

  for (let week = 1; week <= MAX_WEEKS; week++) {
    // advance all trials by one week
    for (const trial of trials) {
      if (isWuwa) {
        advanceTrialWuwa(preferredMainStats, trial, setIdList, matchTargets, characterId, calcs, team);
      } else {
        advanceTrial(preferredMainStats, trial, setIdList, matchTargets, gameId, characterId, calcs, team);
      }
    }

    // if relative error is too high add more trials
    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => trial.scores[week]);
      if (findRelativeError(values) <= 0.005) break;

      // add another trial
      const trial = createTrial(matchTargets, gameId, characterId, build, calcs, team);
      for (let w = 1; w <= week; w++) {
        if (isWuwa) {
          advanceTrialWuwa(preferredMainStats, trial, setIdList, matchTargets, characterId, calcs, team);
        } else {
          advanceTrial(preferredMainStats, trial, setIdList, matchTargets, gameId, characterId, calcs, team);
        }
      }
      trials.push(trial);
    }
  
    let weeklyScores = getAverageScores(trials, week);
    let benchmarkWeek = findBenchmarkWeek(weeklyScores);

    if (benchmarkWeek !== -1 && benchmarkWeek <= week) {
      lastBenchmarkWeek = benchmarkWeek;
      break;
    }

    self.postMessage({ type: "progress", completed: week });
  }

  // If damage never hit plateau, set benchmark to week 20
  if (!lastBenchmarkWeek) {
    lastBenchmarkWeek = 20;
  }

  const weeklyScores = getAverageScores(trials, lastBenchmarkWeek);

  // Average final week equip stats
  const finalStats = {};
  for (let i = 0; i < trials.length; i++) {
    const finalCombined = mergeEquipList(trials[i].build.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat] / trials.length;
    }
  }

  // Main stat distribution at benchmark week (per slot)
  const slotCount = trials[0].build.equipList.length;
  const mainStatDist = Array.from({ length: slotCount }, () => ({}));
  for (const trial of trials) {
    for (let s = 0; s < slotCount; s++) {
      const equip = trial.build.equipList[s];
      if (!equip) continue;
      const id = equip.mainStatId;
      mainStatDist[s][id] = (mainStatDist[s][id] ?? 0) + 1;
    }
  }
  // Normalize to percentages
  for (let s = 0; s < slotCount; s++) {
    const total = Object.values(mainStatDist[s]).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const id in mainStatDist[s]) {
        mainStatDist[s][id] = mainStatDist[s][id] / total;
      }
    }
  }

  // Per-week score percentiles for distribution bands
  const weeklyDistribution = [];
  for (let week = 0; week <= lastBenchmarkWeek; week++) {
    const values = trials.map(t => t.scores[week]).sort((a, b) => a - b);
    const n = values.length;
    weeklyDistribution.push({
      min: values[0],
      p10: values[Math.floor(n * 0.1)],
      q1: values[Math.floor(n * 0.25)],
      median: values[Math.floor(n * 0.5)],
      q3: values[Math.floor(n * 0.75)],
      p90: values[Math.floor(n * 0.9)],
      max: values[n - 1],
    });
  }

  self.postMessage({ type: "done", completed: lastBenchmarkWeek, weeklyScores, finalStats, preferredMainStats, mainStatDist, weeklyDistribution });
};
