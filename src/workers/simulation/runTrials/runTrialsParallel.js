import { mean, linearRegression } from 'simple-statistics';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { findBestPossibleEquipMap } from './bestEquipMap';

const MIN_DAYS = 21;
const MAX_DAYS = 350;

const FIT_START_DAY = 35;
const MIN_FIT_POINTS = 35;

const Q_STABILITY_WINDOW = 35;
const Q_STABILITY_TOLERANCE = 0.05;

function isFitStable(qHistory) {
  if (qHistory.length < Q_STABILITY_WINDOW) return false;
  const recent = qHistory.slice(-Q_STABILITY_WINDOW);
  const spread = Math.max(...recent) - Math.min(...recent);
  return spread < Q_STABILITY_TOLERANCE;
}

function fitRemainingCurve(dayHistory, remainingHistory) {
  const points = dayHistory
    .map((day, i) => ({ day, remaining: remainingHistory[i] }))
    .filter((pt) => pt.day >= FIT_START_DAY && pt.remaining > 0);

  if (points.length < MIN_FIT_POINTS) return null;

  // Transform:
  // ln(remaining) = ln(A) + B * ln(day)
  const logPoints = points.map(({ day, remaining }) => [
    Math.log(day),
    Math.log(remaining),
  ]);

  const { m, b } = linearRegression(logPoints);
  const q = -m;
  if (!(q > 0)) return null;
  const A = Math.exp(b);

  return {
    q,
    A,
    predict: (day) => A * day ** -q,
    dayForRemaining: (remaining) => (A / remaining) ** (1 / q),
  };
}

const waitForReady = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'ready') resolve();
  };
});

const advanceAndGetMean = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'mean') resolve(data.mean);
  };
  worker.postMessage({ type: 'advance' });
});

export async function runTrialsParallel(cache, equipMaps, currId, logDays = false) {
  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  const bestEquipMap = findBestPossibleEquipMap(evaluateEquipMap);
  const dpsCeiling = bestEquipMap.totals.damage / cache.rotationDuration * 1000;

  const dpsProgression = [];
  const dayHistory = [];
  const remainingHistory = [];
  const qHistory = [];
  let lastFit = null;

  // Initialize trials
  const { summary, totals, score } = evaluateEquipMap();
  const baseDps = totals.damage / cache.rotationDuration * 1000;

  dpsProgression.push(baseDps);
  dayHistory.push(0);
  remainingHistory.push(dpsCeiling - baseDps);

  const workers = Array.from(
    { length: 4 },
    () => new Worker(new URL('./runTrialsParallelWorker.js', import.meta.url), { type: 'module' }),
  );
  const readyPromises = workers.map(waitForReady);
  for (const worker of workers) {
    worker.postMessage({ type: 'init', cache, equipMaps, currId, summary, score, baseDps });
  }
  await Promise.all(readyPromises);

  async function advanceDay() {
    const means = await Promise.all(workers.map(advanceAndGetMean));
    return mean(means);
  }

  // Main loop
  for (let day = 1; day <= MAX_DAYS; day++) {
    const currMean = await advanceDay();
    dpsProgression.push(currMean);
    dayHistory.push(day);
    remainingHistory.push(dpsCeiling - currMean);

    if (day < MIN_DAYS) continue;
    const fit = fitRemainingCurve(dayHistory, remainingHistory);
    if (!fit) continue;

    lastFit = fit;
    qHistory.push(fit.q);
    if (logDays) self.postMessage({ day, q: fit.q, A: fit.A });

    if (isFitStable(qHistory)) break;
  }

  console.log(
    `\nDays: ${dpsProgression.length - 1}`,
    `\ndpsCeiling: ${dpsCeiling.toFixed()}`,
    `\nq: ${lastFit?.q.toFixed(4)}`,
    `\nA: ${lastFit?.A.toFixed(4)}`,
  );

  workers.forEach((w) => w.terminate());

  return { dpsProgression, dpsCeiling, fit: lastFit };
}
