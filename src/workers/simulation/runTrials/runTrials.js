import { GI, WW } from '@/data';
import { round, diff } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { createAdvanceTrial } from './advance';
import { createDistribution } from './distribution';
import { initTrials } from './initTrials';

const MIN_WEEKS = 3;
const MAX_WEEKS = 50;

function linearRegression(xs, ys) {
  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const sumXX = xs.reduce((s, x) => s + x * x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

const SMOOTHING_WINDOW = 3;
const FIT_START_WEEK = 5;
const MIN_FIT_POINTS = 10;
function fitPowerLaw(diffHistory) {
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
    console.log('p not > 1:', round(p, 4));
    return null;
  }

  return { p, C, T };
}

const P_STABILITY_WINDOW = 5;
const P_STABILITY_TOLERANCE = 0.02;
function isFitStable(pHistory) {
  if (pHistory.length < P_STABILITY_WINDOW) return false;
  const recent = pHistory.slice(-P_STABILITY_WINDOW);
  const spread = Math.max(...recent) - Math.min(...recent);
  return spread < P_STABILITY_TOLERANCE;
}

const REMAINING_GROWTH_THRESHOLD = 0.1;
function extrapolate(fit, currMean) {
  const { p, C, T } = fit;
  const remainingFraction = (C * Math.pow(T, 1 - p)) / (p - 1);
  const ceilingDps = currMean * (1 + remainingFraction);

  // Solve C * t^(1-p) / (p-1) = threshold for t
  const target = (REMAINING_GROWTH_THRESHOLD * (p - 1)) / C;
  const weeksToThreshold = Math.pow(target, 1 / (1 - p));

  return { p, C, remainingFraction, ceilingDps, weeksToThreshold };
}

export function runTrials(cache, runRotation, currId, logWeeks = false) {
  const evaluateEquipMap = createEvaluateEquipMap(cache, currId, runRotation);
  const advanceTrial = createAdvanceTrial(cache, evaluateEquipMap);
  const trials = [];
  const dpsProgression = [];

  // Week 0
  const { summary, totals, score } = evaluateEquipMap();
  const baseDps = cache.getDps(totals.damage);
  dpsProgression.push({
    mean: baseDps,
    p10: baseDps,
    p25: baseDps,
    p50: baseDps,
    p75: baseDps,
    p90: baseDps,
  });

  const equipListLength = (cache.gameId === GI || cache.gameId === WW) ? 5 : 6;
  const createEquipList = () => new Array(equipListLength).fill(null);
  const createTrial = () => ({ equipList: createEquipList(), summary, score, dps: baseDps });

  // Week 1
  const initialDist = initTrials(trials, createTrial, advanceTrial);
  dpsProgression.push(initialDist.bands);
  const initialDiff = diff(initialDist.mean, baseDps)
  if (logWeeks) self.postMessage({ week: 1, diff: initialDiff });

  // Week 2+
  let prevMean = initialDist.mean;
  const diffHistory = [];
  const pHistory = [];
  let extrapolation = null;
  for (let week = 2; week <= MAX_WEEKS; week++) {
    const currDist = createDistribution();

    for (const trial of trials) {
      advanceTrial(trial);
      currDist.add(trial.dps);
    }

    dpsProgression.push(currDist.bands);
    const currMean = currDist.mean;
    const currDiff = diff(currMean, prevMean);
    if (logWeeks) self.postMessage({ week, diff: currDiff });
    diffHistory.push(currDiff);
    prevMean = currMean;

    if (week < MIN_WEEKS) continue;
    const fit = fitPowerLaw(diffHistory);
    if (!fit) continue;

    pHistory.push(fit.p);
    if (logWeeks) self.postMessage({ week, p: fit.p, C: fit.C });
    if (isFitStable(pHistory)) {
      extrapolation = extrapolate(fit, currMean);
      break;
    }
  }

  console.log(
    `\nTrials: ${trials.length}`,
    `\nWeeks: ${dpsProgression.length - 1}`,
    `\np: ${extrapolation?.p.toFixed(2)}`,
    `\nC: ${extrapolation?.C.toFixed(4)}`,
    `\nremainingFraction: ${extrapolation?.remainingFraction.toFixed(2)}`,
    `\nceilingDps: ${extrapolation?.ceilingDps.toFixed()}`,
    `\nweeksToThreshold: ${extrapolation?.weeksToThreshold.toFixed()}`,
  );

  return { dpsProgression, trials, extrapolation };
}
