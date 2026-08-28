import { mean } from 'simple-statistics';
import { MISC } from '@/data';
import { buildEquipMap } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { createAdvanceTrial } from './advance';
import { getSubRollSums, getMainConfig } from '../utils';

let advanceTrial;
let trials;
let gameId;

self.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init': {
      const { cache, equipMaps, currId, summary, score, baseDps } = data;

      gameId = cache.gameId;

      const equipListLength = MISC[gameId].maxEquips;
      const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);

      advanceTrial = createAdvanceTrial(cache, evaluateEquipMap);

      trials = Array.from({ length: 250 }, () => ({
        equipList: new Array(equipListLength).fill(null),
        summary,
        score,
        dps: baseDps,
      }));

      return self.postMessage({ type: 'ready' });
    }

    case 'runPhase1': {
      const means = [];

      for (let day = 0; day < 30; day++) {
        for (const trial of trials) {
          advanceTrial(trial);
        }

        means.push(mean(trials.map((trial) => trial.dps)));
      }

      return self.postMessage({ type: 'phase1', means });
    }

    case 'buildMeanEquipMap': {
      const meanEquipMap = {};

      for (const trial of trials) {
        const equipMap = buildEquipMap(trial.equipList, true);

        for (const id in equipMap) {
          const value = equipMap[id] / trials.length;
          meanEquipMap[id] = (meanEquipMap[id] ?? 0) + value;
        }
      }

      return self.postMessage({ type: 'meanEquipMap', meanEquipMap });
    }

    case 'runPhase2': {
      for (let day = 0; day < 10; day++) {
        for (const trial of trials) {
          advanceTrial(trial);
        }
      }

      const meanDps = mean(trials.map((trial) => trial.dps));

      return self.postMessage({ type: 'phase2', meanDps });
    }

    case 'tallyConfigMap': {
      const configMap = {};

      for (const trial of trials) {
        const configKey = getMainConfig(gameId, trial.equipList);

        configMap[configKey] ??= { count: 0, subDist: {} };
        configMap[configKey].count++;
        const dist = configMap[configKey].subDist;

        const rollMap = getSubRollSums(gameId, trial.equipList, true);
        for (const id in rollMap) {
          const value = rollMap[id];
          dist[id] = (dist[id] ?? 0) + value;
        }
      }

      return self.postMessage({ type: 'configMap', configMap });
    }
  }
};
