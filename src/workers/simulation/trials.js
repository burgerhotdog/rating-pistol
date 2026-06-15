import { sumRotationDmg } from '@/utils/sumRotationDmg';
import { findBenchmarkWeek, getAverageScores, findRelativeError} from './helpers';
import { createTrial } from './createTrial';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { createMatchMap } from './matchMap';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

export const runTrials = (currentId, cache, data, compiledRotation) => {
  const matchMap = createMatchMap(currentId, data, cache);

  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) {
    const trial = createTrial(cache, currentId, matchMap, compiledRotation);
    trials.push(trial);
  }

  const preferredMainStats = findPreferred(trials[0], currentId, compiledRotation, cache);

  let lastBenchmarkWeek = null;
  let lastDiff = null;

  for (let week = 1; week <= MAX_WEEKS; week++) {
    for (const [trialIndex, trial] of trials.entries()) {
      advanceTrial(preferredMainStats, trial, matchMap, currentId, compiledRotation, cache);
      self.postMessage({ type: 'progress', trial: trialIndex + 1 });
    }

    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => sumRotationDmg(trial.scores[week]));
      if (findRelativeError(values) <= 0.005) break;

      const trial = createTrial(cache, currentId, matchMap, compiledRotation);
      for (let w = 1; w <= week; w++) {
        advanceTrial(preferredMainStats, trial, matchMap, currentId, compiledRotation, cache);
      }
      trials.push(trial);
    }

    const weeklyScores = getAverageScores(trials, week);
    const { benchmarkWeek, diff } = findBenchmarkWeek(weeklyScores);
    lastDiff = diff;

    self.postMessage({ type: 'progress', currentMember: currentId, completed: week, diff });
    if (benchmarkWeek !== -1 && benchmarkWeek <= week) {
      lastBenchmarkWeek = benchmarkWeek;
      break;
    }
  }

  if (!lastBenchmarkWeek) lastBenchmarkWeek = MAX_WEEKS;
  const weeklyScores = getAverageScores(trials, lastBenchmarkWeek);

  return {
    trials,
    preferredMainStats,
    compiledRotation,
    benchmarkWeek: lastBenchmarkWeek,
    weeklyScores,
    diff: lastDiff,
  };
};
