import { GI, WW } from '@/data';
import { mergeEquipList, getTotals } from '@/utils';
import { compileRotation } from './rotation';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { compilePenalty } from './penalty';

const MIN_TRIALS = 50;
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

function addSummaryToSums(sums, summary) {
  for (const [key, footprint] of Object.entries(summary)) {
    const { type } = footprint;

    if (!sums[key]) sums[key] = { ...footprint, [type]: 0 };
    sums[key][type] += footprint[type] ?? 0;
  }
}

const normalizeSummarySums = (sums, n) =>
  Object.fromEntries(
    Object.entries(sums).map(([key, footprint]) => {
      const { type } = footprint;
      return [key, { ...footprint, [type]: footprint[type] / n }];
    })
  );

const getDistribution = (totalsArr) => {
  const sorted = totalsArr.slice().sort((a, b) => a.damage - b.damage);
  const n = sorted.length;

  return {
    p10: sorted[Math.floor(n * 0.1)],
    median: sorted[Math.floor(n * 0.5)],
    p90: sorted[Math.floor(n * 0.9)],
  };
};

const buildFinalStats = (trials) => {
  const n = trials.length;
  const statSums = {};
  for (const trial of trials) {
    const merged = mergeEquipList(trial.equipList);
    for (const stat in merged) {
      statSums[stat] = (statSums[stat] ?? 0) + merged[stat] / n;
    }
  }
  return statSums;
};

export const runTrials = (cache, currId, team, isPrimary = false) => {
  const { gameId, baseMap } = cache.member[currId];
  const simulateRotation = compileRotation(cache, currId, team);
  const getPenalty = compilePenalty(cache, currId);
  const equipListLength = gameId === GI || gameId === WW ? 5 : 6;
  const baseSummary = simulateRotation(baseMap);
  const baseTotals = getTotals(baseSummary);
  const basePenalty = getPenalty(baseMap);
  const baseScore = baseTotals.damage * basePenalty;

  const createTrial = () => ({
    equipList: new Array(equipListLength).fill(null),
    summary: baseSummary,
    totals: baseTotals,
    penalty: basePenalty,
    score: baseScore,
  });

  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) trials.push(createTrial());

  const preferredMainStats = findPreferred(cache, baseTotals.damage, currId, simulateRotation);
  const ctx = { cache, currId, preferredMainStats, simulateRotation, getPenalty };

  const weeklySummaries = isPrimary ? [baseSummary] : null;
  const weeklyDistribution = isPrimary ? [{ p10: baseTotals, median: baseTotals, p90: baseTotals }] : null;

  let prevAvgScore = baseScore;

  for (let week = 1; week <= MAX_WEEKS; week++) {
    const weekSummarySums = isPrimary ? {} : null;
    const weekTotals = isPrimary ? [] : null;
    const weekScores = createScoreTracker();

    for (const trial of trials) {
      advanceTrial(ctx, trial);
      weekScores.add(trial.score);
      if (isPrimary) {
        addSummaryToSums(weekSummarySums, trial.summary);
        weekTotals.push(trial.totals);
      }
    }

    while (week === 1 && trials.length < MAX_TRIALS) {
      if (weekScores.relativeError <= 0.005) break;

      const trial = createTrial();
      advanceTrial(ctx, trial);
      trials.push(trial);

      weekScores.add(trial.score);
      if (isPrimary) {
        addSummaryToSums(weekSummarySums, trial.summary);
        weekTotals.push(trial.totals);
      }
    }

    const avgScore = weekScores.mean;
    const diff = (avgScore - prevAvgScore) / prevAvgScore;

    if (isPrimary) {
      const weeklySummary = normalizeSummarySums(weekSummarySums, trials.length);
      const distribution = getDistribution(weekTotals);

      weeklySummaries.push(weeklySummary);
      weeklyDistribution.push(distribution);

      self.postMessage({ type: 'progress', week, diff });
    }

    if (diff < 0.01) break;
    prevAvgScore = avgScore;
  }

  const finalStatMap = buildFinalStats(trials);

  if (!isPrimary) return { finalStatMap };
  return { finalStatMap, weeklyDistribution, weeklySummaries, simulateRotation };
};
