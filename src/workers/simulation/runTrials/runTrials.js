import { mean, linearRegression } from 'simple-statistics';
import { GI, WW } from '@/data';
import { diff } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { createAdvanceTrial } from './advance';
import { createDistribution } from './distribution';
import { initTrials } from './initTrials';
import { findBestPossibleEquipMap } from './bestEquipMap';

const MIN_WEEKS = 21;
const MAX_WEEKS = 350;
const THRESHOLDS = [0.5, 0.75, 0.9, 0.95, 0.99];

const FIT_START_WEEK = 35;
const MIN_FIT_POINTS = 35;

const Q_STABILITY_WINDOW = 35;
const Q_STABILITY_TOLERANCE = 0.05;

function isFitStable(qHistory) {
  if (qHistory.length < Q_STABILITY_WINDOW) return false;
  const recent = qHistory.slice(-Q_STABILITY_WINDOW);
  const spread = Math.max(...recent) - Math.min(...recent);
  return spread < Q_STABILITY_TOLERANCE;
}

function fitRemainingCurve(weekHistory, remainingHistory) {
  const points = weekHistory
    .map((week, i) => ({ week, remaining: remainingHistory[i] }))
    .filter((pt) => pt.week >= FIT_START_WEEK && pt.remaining > 0);

  if (points.length < MIN_FIT_POINTS) return null;

  // Transform:
  // ln(remaining) = ln(A) + B * ln(week)
  const logPoints = points.map(({ week, remaining }) => [
    Math.log(week),
    Math.log(remaining),
  ]);

  const { m, b } = linearRegression(logPoints);
  const q = -m;
  if (!(q > 0)) return null;
  const A = Math.exp(b);

  return {
    q,
    A,
    predict: (week) => A * week ** -q,
    weekForRemaining: (remaining) => (A / remaining) ** (1 / q),
  };
}

const SMOOTHING_WINDOW = 3;

function smooth(history) {
  const start = Math.max(0, history.length - SMOOTHING_WINDOW);
  return mean(history.slice(start));
}

export function runTrials(cache, equipMaps, currId, logWeeks = false) {
  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);

  const bestEquipMap = findBestPossibleEquipMap(evaluateEquipMap);
  const dpsCeiling = bestEquipMap.totals.damage / cache.rotationDuration * 1000;

  const advanceTrial = createAdvanceTrial(cache, evaluateEquipMap);
  const trials = [];
  const dpsProgression = [];

  // Week 0
  const { summary, totals, score } = evaluateEquipMap();
  const baseDps = totals.damage / cache.rotationDuration * 1000
  dpsProgression.push(baseDps);

  const equipListLength = (cache.gameId === GI || cache.gameId === WW) ? 5 : 6;
  const createEquipList = () => new Array(equipListLength).fill(null);
  const createTrial = () => ({ equipList: createEquipList(), summary, score, dps: baseDps });

  // Week 1
  const initialDist = initTrials(trials, createTrial, advanceTrial);
  dpsProgression.push(initialDist.mean);
  if (logWeeks) self.postMessage({ week: 1, diff: diff(initialDist.mean, baseDps) });

  // Week 2+
  const meanHistory = [baseDps, initialDist.mean];
  const weekHistory = [0, 1];
  const remainingHistory = [dpsCeiling - baseDps, dpsCeiling - initialDist.mean];
  const qHistory = [];

  const thresholdWeeks = {};
  let lastFit = null;

  for (let week = 2; week <= MAX_WEEKS; week++) {
    const currDist = createDistribution();

    for (const trial of trials) {
      advanceTrial(trial);
      currDist.add(trial.dps);
    }

    dpsProgression.push(currDist.mean);

    const currMean = currDist.mean;
    if (logWeeks) self.postMessage({ week, diff: diff(currMean, meanHistory.at(-1)) });

    const prevSmoothedMean = smooth(meanHistory);
    meanHistory.push(currMean);
    const smoothedMean = smooth(meanHistory);
    const smoothedRemaining = dpsCeiling - smoothedMean;

    if (smoothedRemaining < 0 && logWeeks) {
      console.warn(`Week ${week}: smoothed mean (${smoothedMean}) exceeds dps ceiling (${dpsCeiling})`);
    }

    weekHistory.push(week);
    remainingHistory.push(smoothedRemaining);

    for (const threshold of THRESHOLDS) {
      if (thresholdWeeks[threshold]) continue; // already resolved

      const target = threshold * dpsCeiling;
      if (smoothedMean >= target) {
        const prevWeek = week - 1;
        const frac = (target - prevSmoothedMean) / (smoothedMean - prevSmoothedMean);
        thresholdWeeks[threshold] = {
          week: prevWeek + Math.max(0, Math.min(1, frac)),
          isExtrapolated: false,
        };
      }
    }

    if (week < MIN_WEEKS) continue;
    const fit = fitRemainingCurve(weekHistory, remainingHistory);
    if (!fit) continue;

    lastFit = fit;
    qHistory.push(fit.q);
    if (logWeeks) self.postMessage({ week, q: fit.q, A: fit.A });

    const allResolved = THRESHOLDS.every((t) => thresholdWeeks[t]);
    if (allResolved) break;

    if (isFitStable(qHistory)) break;
  }

  if (lastFit) {
    for (const threshold of THRESHOLDS) {
      if (thresholdWeeks[threshold]) continue;

      const targetRemaining = (1 - threshold) * dpsCeiling;
      thresholdWeeks[threshold] = {
        week: lastFit.weekForRemaining(targetRemaining),
        isExtrapolated: true,
      };
    }
  }

  console.log(
    `\nTrials: ${trials.length}`,
    `\nWeeks: ${dpsProgression.length - 1}`,
    `\ndpsCeiling: ${dpsCeiling.toFixed()}`,
    `\nq: ${lastFit?.q.toFixed(4)}`,
    `\nA: ${lastFit?.A.toFixed(4)}`,
    ...THRESHOLDS.map((t) => {
      const entry = thresholdWeeks[t];
      const label = entry?.isExtrapolated ? 'extrapolated' : 'actual';
      return `\nweeksTo${Math.round(t * 100)}%: ${entry?.week.toFixed(1) ?? 'unresolved'} (${label})`;
    }),
  );

  return { dpsProgression, trials, dpsCeiling, thresholdWeeks, fit: lastFit };
}
