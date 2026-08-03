import { GI, WW } from '@/data';
import { getTotals } from '@/utils';
import { createTrialAdvancer } from './advanceTrial';
import { findGoodStats } from './stats/findGoodStats';
import { createGetPenalty } from './penalty';
import { getScore } from './utils';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

const createDistribution = () => {
  const samples = [];
  let n = 0, mean = 0, M2 = 0;
  return {
    add(x) {
      samples.push(x);

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
    get mean() {
      return mean;
    },
    get bands() {
      const sorted = [...samples].sort((a, b) => a - b);
      return {
        mean,
        p10: sorted[Math.floor(sorted.length * 0.1)],
        p25: sorted[Math.floor(sorted.length * 0.25)],
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p75: sorted[Math.floor(sorted.length * 0.75)],
        p90: sorted[Math.floor(sorted.length * 0.9)],
      };
    },
  };
};

export const runTrials = (cache, runRotation, currId, isMain = false) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const getPenalty = createGetPenalty(cache, currId);

  const baseSummary = runRotation(baseMap);
  const baseTotals = getTotals(baseSummary);
  const baseDps = cache.getDps(baseTotals.damage);
  const basePenalty = getPenalty(baseMap);
  const baseScore = getScore(baseSummary, currId, basePenalty);

  const trialBands = [{
    mean: baseDps,
    p10: baseDps,
    p25: baseDps,
    p50: baseDps,
    p75: baseDps,
    p90: baseDps,
  }];
  const goodStats = findGoodStats(cache, baseScore, currId, runRotation, getPenalty);
  const advanceTrial = createTrialAdvancer(cache, currId, goodStats, runRotation, getPenalty);

  // Init trials
  const equipListLength = (gameId === GI || gameId === WW) ? 5 : 6;
  const createTrial = () => ({
    equipList: new Array(equipListLength).fill(null),
    summary: baseSummary,
    dps: baseDps,
    score: baseScore,
  });
  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) trials.push(createTrial());

  // Main trial loop
  let prevMeanDps = baseDps;
  for (let week = 1; week <= MAX_WEEKS; week++) {
    const distribution = createDistribution();

    for (const trial of trials) {
      advanceTrial(trial);
      distribution.add(trial.dps);
    }

    while (week === 1 && trials.length < MAX_TRIALS) {
      if (distribution.relativeError <= 0.01) break;
      const trial = createTrial();
      advanceTrial(trial);
      trials.push(trial);
      distribution.add(trial.dps);
    }

    const meanDps = distribution.mean;
    const diff = (meanDps - prevMeanDps) / prevMeanDps;

    if (isMain) {
      self.postMessage({ week, diff });
      trialBands.push(distribution.bands);
    }

    if (diff < 0.01) break;

    prevMeanDps = meanDps;
  }

  return { trialBands, trials };
};
