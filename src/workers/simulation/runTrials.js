import { GI, WW } from '@/data';
import { clamp } from '@/utils';
import { createEquipListEvaluator } from './evaluateEquipList';
import { createTrialAdvancer } from './advanceTrial';

const FIXED_WEEKS = false;

const MIN_TRIALS = 100;
const MAX_TRIALS = 1000;
const MIN_WEEKS = 3;
const MAX_WEEKS = 50;
const TARGET_RELATIVE_ERROR = 0.005;
const REMAINING_GROWTH_THRESHOLD = 0.1;
const RECOMPUTE_TOLERANCE = 0.01;
const MAX_ITERATIONS = 15;
const SMOOTHING_WINDOW = 3;
const FIT_START_WEEK = 5;
const MIN_FIT_POINTS = 10;
const P_STABILITY_WINDOW = 5;
const P_STABILITY_TOLERANCE = 0.02;

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
    get stdDev() {
      if (n < 2) return 0;
      return Math.sqrt(M2 / (n - 1));
    },
    get mean() {
      return mean;
    },
    get bands() {
      const sorted = [...samples].sort((a, b) => a - b);
      const pick = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
      return {
        mean,
        p10: pick(0.1),
        p20: pick(0.2),
        p30: pick(0.3),
        p40: pick(0.4),
        p50: pick(0.5),
        p60: pick(0.6),
        p70: pick(0.7),
        p80: pick(0.8),
        p90: pick(0.9),
      };
    },
  };
};

const sizeTrialPool = (createTrial, advanceTrial) => {
  const trials = [];
  const dist = createDistribution();

  for (let i = 0; i < MIN_TRIALS; i++) {
    const trial = createTrial();
    advanceTrial(trial);
    trials.push(trial);
    dist.add(trial.dps);
  }

  let prevTarget = null;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const raw = Math.pow(dist.stdDev / (TARGET_RELATIVE_ERROR * Math.abs(dist.mean)), 2);
    const target = clamp(raw, MIN_TRIALS, MAX_TRIALS);

    if (prevTarget !== null) {
      const change = Math.abs(target - prevTarget) / prevTarget;
      if (change < RECOMPUTE_TOLERANCE) break;
    }
    prevTarget = target;

    if (trials.length >= target || trials.length >= MAX_TRIALS) break;
    while (trials.length < target && trials.length < MAX_TRIALS) {
      const trial = createTrial();
      advanceTrial(trial);
      trials.push(trial);
      dist.add(trial.dps);
    }
  }

  return { trials, dist };
};

const linearRegression = (xs, ys) => {
  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const sumXX = xs.reduce((s, x) => s + x * x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

const fitPowerLaw = (diffHistory) => {
  const smoothed = diffHistory.map((_, i) => {
    const start = Math.max(0, i - SMOOTHING_WINDOW + 1);
    const slice = diffHistory.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });

  const points = smoothed
    .map((d, i) => ({ diff: d, week: i + 1 }))
    .filter((pt) => pt.week >= FIT_START_WEEK && pt.diff > 0);

  if (points.length < MIN_FIT_POINTS) {
    console.log('not enough points', points.length, 'of', MIN_FIT_POINTS, 'needed');
    return null;
  }

  const xs = points.map((pt) => Math.log(pt.week));
  const ys = points.map((pt) => Math.log(pt.diff));
  const { slope, intercept } = linearRegression(xs, ys);

  const p = -slope;
  const C = Math.exp(intercept);
  const T = points[points.length - 1].week;

  if (!(p > 1)) {
    console.log('p not > 1:', p);
    return null;
  }

  return { p, C, T };
};

const isFitStable = (pHistory) => {
  if (pHistory.length < P_STABILITY_WINDOW) return false;
  const recent = pHistory.slice(-P_STABILITY_WINDOW);
  const spread = Math.max(...recent) - Math.min(...recent);
  return spread < P_STABILITY_TOLERANCE;
};

const extrapolate = (fit, currentMeanDps) => {
  const { p, C, T } = fit;
  const remainingFraction = (C * Math.pow(T, 1 - p)) / (p - 1);
  const ceilingDps = currentMeanDps * (1 + remainingFraction);

  // Solve C * t^(1-p) / (p-1) = threshold for t
  const target = (REMAINING_GROWTH_THRESHOLD * (p - 1)) / C;
  const weeksToThreshold = Math.pow(target, 1 / (1 - p));

  return { p, C, remainingFraction, ceilingDps, weeksToThreshold };
};

export const runTrials = (cache, runRotation, currId, isMain = false) => {
  const isFixedWeeks = FIXED_WEEKS !== false;
  const { gameId } = cache;
  const evaluateEquipMap = createEquipListEvaluator(cache, currId, runRotation);

  const { summary, totals, score } = evaluateEquipMap();
  const dps = cache.getDps(totals.damage);

  const trialBands = [{
    mean: dps,
    p10: dps,
    p20: dps,
    p30: dps,
    p40: dps,
    p50: dps,
    p60: dps,
    p70: dps,
    p80: dps,
    p90: dps,
  }];

  const advanceTrial = createTrialAdvancer(cache, score, evaluateEquipMap);

  // Init trials
  const equipListLength = (gameId === GI || gameId === WW) ? 5 : 6;
  const createTrial = () => ({
    equipList: new Array(equipListLength).fill(null),
    summary, score, dps,
  });

  // Stage 1: size the trial pool
  const { trials, dist } = sizeTrialPool(createTrial, advanceTrial);
  if (isMain) {
    trialBands.push(dist.bands);
    self.postMessage({ week: 1, diff: (dist.mean - dps) / dps });
  }

  // Stage 2: advance remaining weeks, tracking gains for extrapolation
  let prevMeanDps = dist.mean;
  const diffHistory = [];
  const pHistory = [];
  let extrapolation = null;

  const stoppingWeek = isFixedWeeks ? FIXED_WEEKS : MAX_WEEKS;
  for (let week = 2; week <= stoppingWeek; week++) {
    const distribution = createDistribution();
    for (const trial of trials) {
      advanceTrial(trial);
      distribution.add(trial.dps);
    }

    const meanDps = distribution.mean;
    const diff = (meanDps - prevMeanDps) / prevMeanDps;
    diffHistory.push(diff);

    if (isMain) {
      self.postMessage({ week, diff });
      trialBands.push(distribution.bands);
    }

    if (!isFixedWeeks && week >= MIN_WEEKS) {
      const fit = fitPowerLaw(diffHistory);

      if (fit) {
        pHistory.push(fit.p);

        if (isMain) self.postMessage({ week, p: fit.p, C: fit.C });

        if (isFitStable(pHistory)) {
          extrapolation = extrapolate(fit, meanDps);
          break;
        }
      }
    }

    prevMeanDps = meanDps;
  }

  console.log(
    `Trials: ${trials.length}`,
    `Weeks: ${trialBands.length - 1}`,
    `p: ${extrapolation?.p.toFixed(2)}`,
    `C: ${extrapolation?.C.toFixed(4)}`,
    `remainingFraction: ${extrapolation?.remainingFraction.toFixed(2)}`,
    `ceilingDps: ${extrapolation?.ceilingDps.toFixed()}`,
    `weeksToThreshold: ${extrapolation?.weeksToThreshold.toFixed()}`,
  );

  return { trialBands, trials, extrapolation };
};
