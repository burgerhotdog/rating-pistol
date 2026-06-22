import { GI, WW } from '@/data';
import { sumRotationDmg } from '@/utils';
import { compileRotation } from './rotation';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { compilePenalty } from './penalty';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

const findRelativeError = (list) => {
  const n = list.length;
  const mean = list.reduce((a, b) => a + b) / n;
  const sumSquaredDiff = list.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const standardDeviation = Math.sqrt(sumSquaredDiff / (n - 1));
  const standardError = standardDeviation / Math.sqrt(n);
  return standardError / Math.max(Math.abs(mean), 1e-8);
};

const getAverageSummaries = (trials, weekCount) => {
  const averages = [];

  for (let week = 0; week <= weekCount; week++) {
    const currentSummary = {};
    const blueprintSummary = trials[0].weeklySummary[week];

    for (const [footprintKey, footprint] of Object.entries(blueprintSummary)) {
      const { type } = footprint;

      let sum = 0;

      for (const trial of trials) {
        sum += trial.weeklySummary[week][footprintKey][type] ?? 0;
      }

      currentSummary[footprintKey] = {
        ...footprint,
        [type]: sum / trials.length,
      };
    }

    averages.push(currentSummary);
  }

  return averages;
};

const createTrial = (gameId, baseSummary, basePenalty, baseScore) => {
  const length = gameId === GI || gameId === WW ? 5 : 6

  return {
    equipList: new Array(length).fill(null),
    penalty: basePenalty,
    score: baseScore,
    weeklySummary: [baseSummary],
  };
};

export const runTrials = (cache, currId, team, logProgress = false) => {
  const { gameId, baseMap } = cache.member[currId];
  const simulateRotation = compileRotation(cache, currId, team);
  const getPenalty = compilePenalty(cache, currId);

  const baseSummary = simulateRotation(baseMap);
  const basePenalty = getPenalty(baseMap);
  const baseScore = sumRotationDmg(baseSummary) * basePenalty;
  const trials = [];

  for (let i = 0; i < MIN_TRIALS; i++) {
    const trial = createTrial(gameId, baseSummary, basePenalty, baseScore);
    trials.push(trial);
  }

  const preferredMainStats = findPreferred(cache, trials[0], currId, simulateRotation);

  const ctx = { cache, currId, simulateRotation, getPenalty, preferredMainStats };

  let benchmarkWeek = MAX_WEEKS;
  let lastScore = baseScore;

  for (let week = 1; week <= MAX_WEEKS; week++) {
    for (const trial of trials) advanceTrial(ctx, trial);

    while (week === 1 && trials.length < MAX_TRIALS) {
      const values = trials.map(trial => trial.score);
      if (findRelativeError(values) <= 0.005) break;

      const trial = createTrial(gameId, baseSummary, basePenalty, baseScore);
      for (let w = 1; w <= week; w++) advanceTrial(ctx, trial);

      trials.push(trial);
    }

    const averageScore = trials.reduce((acc, trial) => acc + trial.score / trials.length, 0);
    const currentDiff = (averageScore - lastScore) / lastScore;
    lastScore = averageScore;

    if (logProgress) {
      self.postMessage({ type: 'progress', week, diff: currentDiff });
    }

    if (currentDiff < 0.01) {
      benchmarkWeek = week;
      break;
    }
  }

  const weeklyScores = getAverageSummaries(trials, benchmarkWeek);

  return { simulateRotation, trials, weeklyScores };
};
