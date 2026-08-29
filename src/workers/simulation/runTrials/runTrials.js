import { mean, linearRegression } from 'simple-statistics';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { findBestPossibleEquipMap } from './bestEquipMap';

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

async function initWorkers(payload) {
  const workers = Array.from({ length: 4 }, () => new Worker(
    new URL('./trialsWorker.js', import.meta.url),
    { type: 'module' },
  ));

  const readyPromises = workers.map((worker) => new Promise((resolve) => {
    worker.onmessage = ({ data }) => {
      if (data.type === 'ready') resolve();
    };
  }));

  for (const worker of workers) {
    worker.postMessage(payload);
  }

  await Promise.all(readyPromises);
  return workers;
}

function runContinuous(workers, maxDay, dpsCeil, logDays) {
  return new Promise((resolve) => {
    const pending = new Map(); // day -> meanDps values collected so far
    const dpsUpdates = [];
    const remainingHistory = [];
    let doneCount = 0;
    let meanEquipMap = null;
    let configMap = null;

    const mergeMeanEquipMap = (partial) => {
      meanEquipMap ??= {};
      for (const id in partial) {
        meanEquipMap[id] = (meanEquipMap[id] ?? 0) + partial[id] / workers.length;
      }
    };

    const mergeConfigMap = (partial) => {
      configMap ??= {};
      for (const configKey in partial) {
        const src = partial[configKey];
        configMap[configKey] ??= { count: 0, subDist: {} };
        const dst = configMap[configKey];
        dst.count += src.count;

        for (const id in src.subDist) {
          (dst.subDist[id] ??= []).push(...src.subDist[id]);
        }
      }
    };

    const handleMessage = ({ data }) => {
      switch (data.type) {
        case 'progress': {
          const { day, meanDps } = data;

          if (!pending.has(day)) pending.set(day, []);
          const bucket = pending.get(day);
          bucket.push(meanDps);

          if (bucket.length === workers.length) {
            const avgDps = mean(bucket);
            dpsUpdates.push({ day, mean: avgDps });

            if (maxDay === 100) {
              const remaining = dpsCeil - avgDps;
              if (day >= 95) remainingHistory.push({ day, remaining });
              if (logDays) self.postMessage({ progressDay: day });
            }

            pending.delete(day);
          }

          break;
        }

        case 'meanEquipMap': {
          mergeMeanEquipMap(data.meanEquipMap);
          doneCount++;

          if (doneCount === workers.length) {
            resolve({ dpsUpdates, meanEquipMap });
          }

          break;
        }

        case 'configMap': {
          mergeConfigMap(data.configMap);
          doneCount++;

          if (doneCount === workers.length) {
            resolve({ dpsUpdates, remainingHistory, configMap });
          }

          break;
        }
      }
    };

    workers.forEach((worker) => {
      worker.onmessage = handleMessage;
      worker.postMessage({ type: 'run', maxDay });
    });
  });
}

export async function runTrials(cache, equipMaps, currId, logDays = false) {
  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  const bestEquipMap = findBestPossibleEquipMap(evaluateEquipMap);
  const dpsCeil = bestEquipMap.totals.damage / cache.rotationDuration * 1000;

  const dpsProgression = [];

  // Initialize trials
  if (logDays) {
    self.postMessage({ status: `Initializing Trials` });
  }

  const { summary, totals, score } = evaluateEquipMap();
  const baseDps = totals.damage / cache.rotationDuration * 1000;
  dpsProgression.push({ day: 0, mean: baseDps });

  const workers = await initWorkers({ type: 'init', cache, equipMaps, currId, summary, score, baseDps });

  // Phase 1
  if (logDays) {
    self.postMessage({ status: `Running Trials` });
  }

  const maxDay = logDays ? 100 : 30;
  const result = await runContinuous(workers, maxDay, dpsCeil, logDays);

  dpsProgression.push(...result.dpsUpdates);
  workers.forEach((worker) => worker.terminate());

  if (!logDays) {
    return result.meanEquipMap;
  }

  const fit = fitRemainingCurve(result.remainingHistory);

  return {
    dpsProgression,
    dpsCeiling: dpsCeil,
    fit,
    configMap: result.configMap,
  };
}
