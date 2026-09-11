import { mean } from 'simple-statistics';
import { MISC } from '@/data';
import { buildEquipListConfigs, buildEquipMap } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { createAdvanceTrial } from './advance';

let advanceTrial;
let trials;
let gameId;

self.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init': {
      const { cache, equipMaps, currId, snapshots, score } = data;

      gameId = cache.gameId;

      const equipListLength = MISC[gameId].maxEquips;
      const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);

      advanceTrial = createAdvanceTrial(cache, evaluateEquipMap, currId);

      trials = Array.from({ length: 250 }, () => ({
        equipList: new Array(equipListLength).fill(null),
        snapshots,
        score,
      }));

      return self.postMessage({ type: 'ready' });
    }

    case 'run': {
      const { maxDay } = data;

      for (let day = 1; day <= maxDay; day++) {
        for (const trial of trials) {
          advanceTrial(trial);
        }

        const meanDps = mean(trials.map((trial) => trial.score));
        self.postMessage({ type: 'progress', day, meanDps });
      }

      // Early-exit path (non-logDays): report the mean equip map at day 30
      if (maxDay === 30) {
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

      // Full run: report the config tally at day 100
      const partialEquipListConfigs = buildEquipListConfigs(gameId, trials);
      return self.postMessage({ type: 'partialEquipListConfigs', partialEquipListConfigs });
    }
  }
};
