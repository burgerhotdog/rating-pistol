import { mergeEquipList, computeTotalStat, compileStatMap } from "@/utils";
import { findBenchmarkWeek, getAverageScores } from "./helpers";
import { findRelativeError } from "./helpers";
import { createTrial } from "./createTrial";
import { advanceTrial } from "./advanceTrial";
import { advanceTrialWuwa } from "./advanceTrialWuwa";

const MIN_TRIALS = 100;
const MAX_TRIALS = 1000;
const MAX_WEEKS = 20;

self.onmessage = ({ data }) => {
  const { gameId, characterId, build, criteria, team } = data;
  const setIdList = build.equipList.map(equip => equip?.setId);
  const matchTargets = (criteria.match ?? []).map(stat => {
    return computeTotalStat(stat, compileStatMap(gameId, characterId, build, team, "menu"));
  });
  const trials = [];
  let lastBenchmarkWeek = null;

  // Initialize first week
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial(matchTargets, gameId, characterId, build, criteria, team));
  }

  for (let week = 1; week <= MAX_WEEKS; week++) {
    // advance all trials by one week
    for (const trial of trials) {
      if (gameId === "wuthering-waves") {
        advanceTrialWuwa(trial, setIdList, matchTargets, gameId, characterId, criteria, team);
      } else {
        advanceTrial(trial, setIdList, matchTargets, gameId, characterId, criteria, team);
      }
    }

    // if relative error is too high add more trials
    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => trial.scores[week]);
      if (findRelativeError(values) <= 0.005) break;

      // add another trial
      const trial = createTrial(matchTargets, gameId, characterId, build, criteria, team);
      for (let w = 1; w <= week; w++) {
        if (gameId === "wuthering-waves") {
          advanceTrialWuwa(trial, setIdList, matchTargets, gameId, characterId, criteria, team);
        } else {
          advanceTrial(trial, setIdList, matchTargets, gameId, characterId, criteria, team);
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

  self.postMessage({ type: "done", completed: lastBenchmarkWeek, weeklyScores, finalStats });
};
