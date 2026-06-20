import { MISC } from '@/data';
import { sumRotationDmg } from '@/utils';
import { findBenchmarkWeek, getAverageScores, findRelativeError} from './helpers';
import { compileRotation, evaluateRotation } from './rotation';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { createMatchMap } from './matchMap';
import { getPenalty } from './penalty';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

const createTrial = (cache, currId, matchMap, compiledRotation) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const { NUM_MAINSTATS } = MISC[gameId];

  return {
    equipList: new Array(NUM_MAINSTATS).fill(null),
    penalty: getPenalty(baseMap, matchMap),
    scores: [evaluateRotation(compiledRotation, baseMap)],
  };
};

export const runTrials = (cache, currId, team) => {
  const matchMap = createMatchMap(cache, currId);
  const compiledRotation = compileRotation(cache, currId, team);

  const trials = [];

  for (let i = 0; i < MIN_TRIALS; i++) {
    const trial = createTrial(cache, currId, matchMap, compiledRotation);
    trials.push(trial);
  }

  const preferredMainStats = findPreferred(cache, trials[0], currId, compiledRotation);

  const ctx = { cache, currId, matchMap, compiledRotation, preferredMainStats };

  let lastBenchmarkWeek = null;
  let lastDiff = null;

  for (let week = 1; week <= MAX_WEEKS; week++) {
    for (const [index, trial] of trials.entries()) {
      advanceTrial(ctx, trial);

      self.postMessage({
        type: 'progress',
        trial: index + 1,
      });
    }

    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => sumRotationDmg(trial.scores[week]));
      if (findRelativeError(values) <= 0.005) break;

      const trial = createTrial(cache, currId, matchMap, compiledRotation);

      for (let w = 1; w <= week; w++) {
        advanceTrial(ctx, trial);
      }

      trials.push(trial);
    }

    const weeklyScores = getAverageScores(trials, week);
    const { benchmarkWeek, diff } = findBenchmarkWeek(weeklyScores);
    lastDiff = diff;

    self.postMessage({
      type: 'progress',
      currentMember: currId,
      completed: week,
      diff,
    });

    if (benchmarkWeek !== -1 && benchmarkWeek <= week) {
      lastBenchmarkWeek = benchmarkWeek;
      break;
    }
  }

  if (!lastBenchmarkWeek) {
    lastBenchmarkWeek = MAX_WEEKS;
  }

  const weeklyScores = getAverageScores(trials, lastBenchmarkWeek);

  return {
    compiledRotation,
    trials,
    preferredMainStats,
    benchmarkWeek: lastBenchmarkWeek,
    weeklyScores,
    diff: lastDiff,
  };
};
