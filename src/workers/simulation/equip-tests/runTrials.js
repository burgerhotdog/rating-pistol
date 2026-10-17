import { mean } from 'simple-statistics';

function mergeMeanEquipMaps(meanEquipMaps) {
  const merged = {};

  for (const partial of meanEquipMaps) {
    for (const stat in partial) {
      merged[stat] = (merged[stat] ?? 0) + partial[stat] / meanEquipMaps.length;
    }
  }

  return merged;
}

function mergeEquipListConfigs(equipListConfigs) {
  const merged = {};

  for (const partial of equipListConfigs) {
    for (const configKey in partial) {
      const partialConfig = partial[configKey];

      const config = merged[configKey] ??= {
        trialCount: 0,
        substatRolls: {},
      };

      config.trialCount += partialConfig.trialCount;

      for (const stat in partialConfig.substatRolls) {
        const rolls = config.substatRolls[stat] ??= [];
        rolls.push(...partialConfig.substatRolls[stat]);
      }
    }
  }

  return merged;
}

export function collectResults(workers, payload, isMainChar) {
  return new Promise((resolve) => {
    const pending = new Map();
    const scoreUpdates = [];
    const dpsUpdates = [];
    const workerMeanEquipMaps = [];
    const workerEquipListConfigs = [];

    const handleProgress = ({ day, score: workerScore, dps: workerDps }) => {
      const workerMeans = pending.get(day) ?? { score: [], dps: [] };
      workerMeans.score.push(workerScore);
      workerMeans.dps.push(workerDps);
      pending.set(day, workerMeans);

      if (workerMeans.score.length !== workers.length) return;

      scoreUpdates.push({
        day,
        mean: mean(workerMeans.score),
      });

      dpsUpdates.push({
        day,
        mean: mean(workerMeans.dps),
      });

      if (isMainChar) {
        self.postMessage({ message: `Day ${day}`, progressDay: day });
      }

      pending.delete(day);
    };

    const handleMessage = ({ data }) => {
      switch (data.type) {
        case 'progress':
          handleProgress(data);
          break;

        case 'meanEquipMap':
          workerMeanEquipMaps.push(data.meanEquipMap);
          if (workerMeanEquipMaps.length === workers.length) {
            resolve({
              meanEquipMap: mergeMeanEquipMaps(workerMeanEquipMaps),
            });
          }
          break;

        case 'equipListConfigs':
          workerEquipListConfigs.push(data.equipListConfigs);
          if (workerEquipListConfigs.length === workers.length) {
            resolve({
              scoreUpdates,
              dpsUpdates,
              equipListConfigs: mergeEquipListConfigs(workerEquipListConfigs),
            });
          }
          break;
      }
    };

    workers.forEach((worker) => {
      worker.onmessage = handleMessage;
      worker.postMessage(payload);
    });
  });
}

export async function runTrials(cache, equipMaps, currId, isMainChar = false, calibration = { damage: 1 }) {
  if (isMainChar) self.postMessage({ message: `Running Trials` });

  const workers = Array.from({ length: 4 }, () => new Worker(
    new URL('./trials-worker/worker.js', import.meta.url),
    { type: 'module' },
  ));

  const payload = {
    cache,
    equipMaps,
    currId,
    quick: !isMainChar,
    calibration,
  };

  const results = await collectResults(workers, payload, isMainChar);

  workers.forEach((worker) => worker.terminate());

  return results;
}
