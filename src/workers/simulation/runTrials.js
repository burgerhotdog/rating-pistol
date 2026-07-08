import { GI, WW } from '@/data';
import { mergeEquipList } from '@/utils';
import { createRunRotation } from './rotation';
import { createTrialAdvancer } from './advanceTrial';
import { findGoodStats } from './stats/findGoodStats';
import { createGetPenalty } from './penalty';
import { getSubRollSums, getWeightedScore, getMainConfig } from './utils';

const MIN_TRIALS = 100;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

const createScoreTracker = () => {
  let n = 0, mean = 0, M2 = 0;
  return {
    add(x) {
      n++;
      const delta = x - mean;
      mean += delta / n;
      M2 += delta * (x - mean);
    },
    get relativeError() {
      if (n < 2) return Infinity;
      const stdErr = Math.sqrt(M2 / (n - 1) / n);
      return stdErr / Math.max(Math.abs(mean), 1e-8);
    },
    get mean() { return mean; },
  };
};

const buildConfigStats = (gameId, trials) => {
  const configMap = {};

  for (const trial of trials) {
    const key = getMainConfig(gameId, trial.equipList);

    if (!configMap[key]) {
      configMap[key] = {
        count: 0,
        subRollSums: {},
      };
    }

    const entry = configMap[key];
    entry.count++;

    const { subRollSums } = entry;
    for (const [statId, rolls] of Object.entries(getSubRollSums(gameId, trial.equipList))) {
      subRollSums[statId] = (subRollSums[statId] ?? 0) + rolls;
    }
  }

  for (const { count, subRollSums } of Object.values(configMap)) {
    for (const [statId, rolls] of Object.entries(subRollSums)) {
      subRollSums[statId] = rolls / count;
    }
  }

  return configMap;
};

const normalizeSummarySums = (sums, n) =>
  Object.fromEntries(
    Object.entries(sums).map(([key, footprint]) => {
      const { type } = footprint;
      return [key, { ...footprint, [type]: footprint[type] / n }];
    })
  );

function addSummaryToSums(sums, summary) {
  for (const [key, footprint] of Object.entries(summary)) {
    const { type } = footprint;

    sums[key] ??= { ...footprint, [type]: 0 };
    sums[key][type] += footprint[type] ?? 0;
  }
}

export const runTrials = (cache, equipMaps, currId, isMain = false) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const runRotation = createRunRotation(cache, equipMaps, currId);
  const getPenalty = createGetPenalty(cache, currId);

  const baseSummary = runRotation(baseMap);
  const basePenalty = getPenalty(baseMap);
  const baseScore = getWeightedScore(baseSummary, currId, basePenalty);

  const weeklySummaries = [baseSummary];
  const goodStats = findGoodStats(cache, baseScore, currId, runRotation, getPenalty);
  const advanceTrial = createTrialAdvancer(cache, currId, goodStats, runRotation, getPenalty);

  // Init trials
  const equipListLength = (gameId === GI || gameId === WW) ? 5 : 6;
  const createTrial = () => ({
    equipList: new Array(equipListLength).fill(null),
    summary: baseSummary,
    score: baseScore,
  });
  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial());
  }

  // Main trial loop
  let prevAvgScore = baseScore;
  for (let week = 1; week <= MAX_WEEKS; week++) {
    const weekSummarySums = {};
    const weekScores = createScoreTracker();

    for (const trial of trials) {
      advanceTrial(trial);
      weekScores.add(trial.score);

      if (isMain) {
        addSummaryToSums(weekSummarySums, trial.summary);
      }
    }

    while (week === 1 && trials.length < MAX_TRIALS) {
      if (weekScores.relativeError <= 0.005) {
        break;
      }

      const trial = createTrial();
      advanceTrial(trial);
      trials.push(trial);

      weekScores.add(trial.score);
      if (isMain) {
        addSummaryToSums(weekSummarySums, trial.summary);
      }
    }

    const avgScore = weekScores.mean;
    const diff = (avgScore - prevAvgScore) / prevAvgScore;

    if (isMain) {
      self.postMessage({ week, diff });
      const weeklySummary = normalizeSummarySums(weekSummarySums, trials.length);
      weeklySummaries.push(weeklySummary);
    }

    if (diff < 0.01) {
      break;
    }

    prevAvgScore = avgScore;
  }

  if (!isMain) {
    const avgEquipMap = {};
    for (const { equipList } of trials) {
      const equipMap = mergeEquipList(equipList);
      for (const [stat, value] of Object.entries(equipMap)) {
        avgEquipMap[stat] ??= 0;
        avgEquipMap[stat] += value / trials.length;
      }
    }
    return avgEquipMap;
  }
  
  self.postMessage({
    cache,
    weeklySummaries,
    userSummary: runRotation(cache.member[currId].statMap),
    configMap: buildConfigStats(gameId, trials),
    userConfigKey: getMainConfig(gameId, cache.member[currId].equipList),
    userSubStats: getSubRollSums(gameId, cache.member[currId].equipList),
  });
};
