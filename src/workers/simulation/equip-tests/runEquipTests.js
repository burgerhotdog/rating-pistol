import { mean } from 'simple-statistics';
import { buildSkippable, computeDpsCeiling, fitDecay, mergeEquipListConfigs } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';

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

function runContinuous(workers, dpsCeiling, isMainChar) {
  return new Promise((resolve) => {
    const pending = new Map(); // day -> meanDps values collected so far
    const dpsUpdates = [];
    const remainingHistory = [];
    let doneCount = 0;
    let meanEquipMap = null;
    const partialEquipListConfigsList = [];

    const mergeMeanEquipMap = (partial) => {
      meanEquipMap ??= {};
      for (const id in partial) {
        meanEquipMap[id] = (meanEquipMap[id] ?? 0) + partial[id] / workers.length;
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

            if (isMainChar) {
              const remaining = dpsCeiling - avgDps;
              if (day >= 95) remainingHistory.push({ day, remaining });
              if (isMainChar) self.postMessage({ message: `Day ${day}`, progressDay: day });
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

        case 'partialEquipListConfigs': {
          partialEquipListConfigsList.push(data.partialEquipListConfigs);

          if (partialEquipListConfigsList.length === workers.length) {
            const equipListConfigs = mergeEquipListConfigs(partialEquipListConfigsList);
            resolve({ dpsUpdates, remainingHistory, equipListConfigs });
          }

          break;
        }
      }
    };

    workers.forEach((worker) => {
      worker.onmessage = handleMessage;
      worker.postMessage({ type: 'run', maxDay: isMainChar ? 100 : 30 });
    });
  });
}

export async function runEquipTests(cache, equipMaps, currId, isMainChar = false) {
  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  const { snapshots, score: dpsFloor } = evaluateEquipMap();
  const skippable = buildSkippable(cache.gameId, dpsFloor, evaluateEquipMap);

  const dpsCeiling = computeDpsCeiling(cache.gameId, evaluateEquipMap, currId, skippable);

  const dpsProgression = [];

  // Initialize trials
  if (isMainChar) self.postMessage({ message: `Initializing Trials` });
  dpsProgression.push({ day: 0, mean: dpsFloor });
  const workers = await initWorkers({ type: 'init', cache, equipMaps, currId, snapshots, score: dpsFloor });

  if (isMainChar) self.postMessage({ message: `Running Trials` });
  const result = await runContinuous(workers, dpsCeiling, isMainChar);

  dpsProgression.push(...result.dpsUpdates);
  workers.forEach((worker) => worker.terminate());

  if (!isMainChar) {
    return result.meanEquipMap;
  }

  const fit = fitDecay(result.remainingHistory.map(({ day, remaining }) => [day, remaining]));

  return {
    dpsProgression,
    dpsCeiling,
    fit,
    equipListConfigs: result.equipListConfigs,
  };
}
