import { mean } from 'simple-statistics';

export function runContinuous(workers, mpsCeiling, isMainChar) {
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
