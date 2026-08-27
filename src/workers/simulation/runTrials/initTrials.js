import { clamp } from '@/utils';
import { createDistribution } from './distribution';

const MIN_TRIALS = 1000;
const MAX_TRIALS = 1000;
const MAX_ITERATIONS = 15;
const TARGET_RELATIVE_ERROR = 0.005;
const RECOMPUTE_TOLERANCE = 0.01;

export function initTrials(trials, createTrial, advanceTrial) {
  const distribution = createDistribution();

  for (let i = 0; i < MIN_TRIALS; i++) {
    const trial = createTrial();
    advanceTrial(trial);
    trials.push(trial);
    distribution.add(trial.dps);
  }

  let prevTarget = null;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const raw = Math.pow(distribution.stdDev / (TARGET_RELATIVE_ERROR * Math.abs(distribution.mean)), 2);
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
      distribution.add(trial.dps);
    }
  }

  return distribution;
}
