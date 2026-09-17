import { linearRegression, mean } from 'simple-statistics';
import { buildSkippable } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { computeCeiling } from './computeCeiling';

async function initWorkers(payload) {
  const workers = Array.from({ length: 4 }, () => new Worker(
    new URL('./trials-worker/worker.js', import.meta.url),
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

function runContinuous(workers, mpsCeiling, isMainChar) {
  return new Promise((resolve) => {
    const pending = new Map();
    const dpsUpdates = [];
    const remainingHistory = [];
    const partialMeanEquipMaps = [];
    const partialEquipListConfigsList = [];

    const handleMessage = ({ data }) => {
      switch (data.type) {
        case 'progress': {
          const { day, mean: partialMeanMps } = data;

          if (!pending.has(day)) {
            pending.set(day, []);
          }

          const bucket = pending.get(day);
          bucket.push(partialMeanMps);

          if (bucket.length === workers.length) {
            const meanMps = mean(bucket);
            dpsUpdates.push({ day, mean: meanMps });

            if (isMainChar) {
              const remaining = mpsCeiling - meanMps;

              if (day >= 95) {
                remainingHistory.push({ day, remaining });
              }

              self.postMessage({ message: `Day ${day}`, progressDay: day });
            }

            pending.delete(day);
          }

          break;
        }

        case 'meanEquipMap': {
          partialMeanEquipMaps.push(data.meanEquipMap);

          if (partialMeanEquipMaps.length === workers.length) {
            const meanEquipMap = {};

            for (const partial of partialMeanEquipMaps) {
              for (const stat in partial) {
                const value = partial[stat] / workers.length;
                meanEquipMap[stat] = (meanEquipMap[stat] ?? 0) + value;
              }
            }

            resolve({ dpsUpdates, meanEquipMap });
          }

          break;
        }

        case 'equipListConfigs': {
          partialEquipListConfigsList.push(data.equipListConfigs);

          if (partialEquipListConfigsList.length === workers.length) {
            const equipListConfigs = {};

            for (const partial of partialEquipListConfigsList) {
              for (const configKey in partial) {
                const partialConfig = partial[configKey];
                const config = equipListConfigs[configKey] ??= { trialCount: 0, substatRolls: {} };

                config.trialCount += partialConfig.trialCount;

                for (const stat in partialConfig.substatRolls) {
                  const partialRolls = partialConfig.substatRolls[stat];
                  const rolls = config.substatRolls[stat] ??= [];

                  rolls.push(...partialRolls);
                }
              }
            }

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
  const { gameId } = cache;
  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  const { snapshots, score } = evaluateEquipMap();
  const skippable = buildSkippable(gameId, score, evaluateEquipMap);
  const mpsCeiling = computeCeiling(gameId, evaluateEquipMap, currId, skippable);
  const dpsProgression = [];

  // Initialize trials
  if (isMainChar) self.postMessage({ message: `Initializing Trials` });
  dpsProgression.push({ day: 0, mean: score });
  const workers = await initWorkers({
    type: 'init',
    cache,
    equipMaps,
    currId,
    snapshots,
    score,
    skippable,
    quick: !isMainChar,
  });

  if (isMainChar) self.postMessage({ message: `Running Trials` });
  const {
    dpsUpdates,
    meanEquipMap,
    remainingHistory,
    equipListConfigs,
  } = await runContinuous(workers, mpsCeiling, isMainChar);

  dpsProgression.push(...dpsUpdates);
  workers.forEach((worker) => worker.terminate());

  if (!isMainChar) {
    return meanEquipMap;
  }

  const logPoints = remainingHistory.map(({ day, remaining }) => [
    Math.log(day),
    Math.log(remaining),
  ]);
  const { m, b } = linearRegression(logPoints);
  const fit = { k: -m, A: Math.exp(b) };

  return {
    dpsProgression,
    dpsCeiling: mpsCeiling,
    fit,
    equipListConfigs,
  };
}
