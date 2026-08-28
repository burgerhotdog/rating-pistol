import { mean, linearRegression } from 'simple-statistics';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { findBestPossibleEquipMap } from './bestEquipMap';
import { estimateDps } from '@/utils';

function fitRemainingCurve(remainingHistory) {
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

  // Initialize trials
  if (logDays) {
    self.postMessage({
      status: `Initializing Trials`,
    });
  }
  const { summary, totals, score } = evaluateEquipMap();
  const baseDps = totals.damage / cache.rotationDuration * 1000;
  dpsProgression.push({ day: 0, mean: baseDps });

  const workers = await initWorkers({ type: 'init', cache, equipMaps, currId, summary, score, baseDps });

  // Phase 1
  if (logDays) {
    self.postMessage({
      status: `Phase 1`,
    });
  }
  const workerMeans = await Promise.all(workers.map(runPhase1));
  for (let day = 1; day < 31; day++) {
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
  if (logDays) {
    self.postMessage({
      status: `Phase 2`,
    });
  }
  const remainingHistory = [];
  for (let day = 40; day <= 100; day += 10) {
    if (logDays) {
      self.postMessage({
        status: `Phase 2: Day ${day}`,
      });
    }

    const workerMeanDps = await Promise.all(workers.map(runPhase2));
    const meanDps = mean(workerMeanDps);
    dpsProgression.push({ day, mean: meanDps });

    const remaining = dpsCeil - meanDps;
    if (day >= 90) {
      remainingHistory.push({ day, remaining });
    }
  }

  const fit = fitRemainingCurve(remainingHistory);

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
  return { dpsProgression, dpsCeiling: dpsCeil, fit, configMap };
}
