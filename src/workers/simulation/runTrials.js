import { GI, WW, CHARACTER } from '@/data';
import { sumRotationDmg, getAttr } from '@/utils';
import { findBenchmarkWeek, findRelativeError} from './helpers';
import { compileRotation, evaluateRotation } from './rotation';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { getPenalty } from './penalty';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

const createMatchMap = (cache, currId) => {
  const { gameId, member } = cache;

  const { matchList = [], tagged = [] } = CHARACTER[gameId][currId];
  const { statMap } = member[currId];
  const matchMap = {};

  for (const attr of matchList) {
    matchMap[attr] = getAttr(attr, statMap);
  }

  if (!tagged.includes('noEnergy')) {
    matchMap.energyRegen = getAttr('energyRegen', statMap);
  }

  return matchMap;
};


function getAverageSummaries(trials, weekCount) {
  const averages = [];

  for (let week = 0; week <= weekCount; week++) {
    const currentWeekRotMap = {};
    const blueprintSummary = trials[0].weeklySummary[week];

    for (const key in blueprintSummary) {
      const footprint = blueprintSummary[key];
      const { type } = footprint;

      let sum = 0;

      for (const trial of trials) {
        const currentWeekSummary = trial.weeklySummary[week];

        sum += currentWeekSummary[key][type] ?? 0;
      }

      currentWeekRotMap[key] = {
        ...footprint,
        [type]: sum / trials.length,
      };
    }

    averages.push(currentWeekRotMap);
  }

  return averages;
}

const createTrial = (cache, currId, matchMap, compiledRotation) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const length = gameId === GI || gameId === WW ? 5 : 6

  return {
    equipList: new Array(length).fill(null),
    penalty: getPenalty(baseMap, matchMap),
    weeklySummary: [evaluateRotation(compiledRotation, baseMap)],
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
      const values = trials.map(trial => sumRotationDmg(trial.weeklySummary[week]));
      if (findRelativeError(values) <= 0.005) break;

      const trial = createTrial(cache, currId, matchMap, compiledRotation);

      for (let w = 1; w <= week; w++) {
        advanceTrial(ctx, trial);
      }

      trials.push(trial);
    }

    const weeklyScores = getAverageSummaries(trials, week);
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

  const weeklyScores = getAverageSummaries(trials, lastBenchmarkWeek);

  return {
    compiledRotation,
    trials,
    preferredMainStats,
    benchmarkWeek: lastBenchmarkWeek,
    weeklyScores,
    diff: lastDiff,
  };
};
