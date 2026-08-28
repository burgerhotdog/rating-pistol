import { mean, linearRegression } from 'simple-statistics';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { findBestPossibleEquipMap } from './bestEquipMap';

const Q_STABILITY_WINDOW = 5;
const Q_STABILITY_TOLERANCE = 0.05;

function isFitStable(qHistory) {
  if (qHistory.length < Q_STABILITY_WINDOW) return false;
  const recent = qHistory.slice(-Q_STABILITY_WINDOW);
  const spread = Math.max(...recent) - Math.min(...recent);
  return spread < Q_STABILITY_TOLERANCE;
}

function fitRemainingCurve(remainingHistory) {
  if (remainingHistory.length < 3) return;

  // Transform:
  // ln(remaining) = ln(A) + B * ln(day)
  const logPoints = remainingHistory.map(({ day, remaining }) => [
    Math.log(day),
    Math.log(remaining),
  ]);

  const { m, b } = linearRegression(logPoints);
  const q = -m;
  if (!(q > 0)) return;

  const A = Math.exp(b);
  return { q, A };
}

const createWorker = () => new Worker(
  new URL('./trialsWorker.js', import.meta.url),
  { type: 'module' },
);

const waitForReady = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'ready') resolve();
  };
});

const runPhase1 = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'phase1') resolve(data.means);
  };
  worker.postMessage({ type: 'runPhase1' });
});

const buildMeanEquipMap = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'meanEquipMap') resolve(data.meanEquipMap);
  };
  worker.postMessage({ type: 'buildMeanEquipMap' });
});

const runPhase2 = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'phase2') resolve(data.meanDps);
  };
  worker.postMessage({ type: 'runPhase2' });
});

const tallyConfigMap = (worker) => new Promise((resolve) => {
  worker.onmessage = ({ data }) => {
    if (data.type === 'configMap') resolve(data.configMap);
  };
  worker.postMessage({ type: 'tallyConfigMap' });
});

async function initWorkers(payload) {
  const workers = Array.from({ length: 4 }, createWorker);
  const readyPromises = workers.map(waitForReady);
  for (const worker of workers) {
    worker.postMessage(payload);
  }
  await Promise.all(readyPromises);
  return workers;
}

export async function runTrials(cache, equipMaps, currId, logDays = false) {
  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  const bestEquipMap = findBestPossibleEquipMap(evaluateEquipMap);
  const dpsCeil = bestEquipMap.totals.damage / cache.rotationDuration * 1000;

  const dpsProgression = [];
  const qHistory = [];
  let lastFit = null;

  // Initialize trials
  const { summary, totals, score } = evaluateEquipMap();
  const baseDps = totals.damage / cache.rotationDuration * 1000;
  dpsProgression.push({ day: 0, mean: baseDps });

  const workers = await initWorkers({ type: 'init', cache, equipMaps, currId, summary, score, baseDps });

  // Phase 1
  const workerMeans = await Promise.all(workers.map(runPhase1));
  for (let day = 1; day < 22; day++) {
    dpsProgression.push({
      day,
      mean: mean(workerMeans.map((means) => means[day - 1])),
    });
  }

  // Early exit for non charId
  if (!logDays) {
    const workerMeanEquipMaps = await Promise.all(workers.map(buildMeanEquipMap));
    const meanEquipMap = {};

    for (const workerMeanEquipMap of workerMeanEquipMaps) {
      for (const id in workerMeanEquipMap) {
        const value = workerMeanEquipMap[id] / workers.length;
        meanEquipMap[id] = (meanEquipMap[id] ?? 0) + value;
      }
    }

    workers.forEach((worker) => worker.terminate());
    return meanEquipMap;
  }

  // Phase 2
  const remainingHistory = [];
  for (let day = 28; day <= 700; day += 7) {
    const workerMeanDps = await Promise.all(workers.map(runPhase2));
    const meanDps = mean(workerMeanDps);
    dpsProgression.push({ day, mean: meanDps });

    const remaining = dpsCeil - meanDps;
    remainingHistory.push({ day, remaining });

    const fit = fitRemainingCurve(remainingHistory);
    if (!fit) continue;

    lastFit = fit;
    qHistory.push(fit.q);

    if (isFitStable(qHistory)) break;
  }

  // Configs
  const workerConfigMaps = await Promise.all(workers.map(tallyConfigMap));
  const configMap = {};
  for (const workerConfigMap of workerConfigMaps) {
    for (const configKey in workerConfigMap) {
      const workerConfig = workerConfigMap[configKey];

      configMap[configKey] ??= { count: 0, subDist: {} };
      configMap[configKey].count += workerConfig.count;
      const dist = configMap[configKey].subDist;

      for (const id in workerConfig.subDist) {
        const value = workerConfig.subDist[id];
        dist[id] = (dist[id] ?? 0) + value;
      }
    }
  }

  for (const configKey in configMap) {
    const config = configMap[configKey];
    const dist = config.subDist;

    for (const id in dist) {
      const value = dist[id];
      dist[id] = value / config.count;
    }
  }

  workers.forEach((worker) => worker.terminate());
  return { dpsProgression, dpsCeiling: dpsCeil, fit: lastFit, configMap };
}
