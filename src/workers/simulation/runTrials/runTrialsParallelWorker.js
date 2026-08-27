import { mean } from 'simple-statistics';
import { MISC } from '@/data';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { createAdvanceTrial } from './advance';

let advanceTrial;
let trials;

self.onmessage = ({ data }) => {
  if (data.type === 'init') {
    const { cache, equipMaps, currId, summary, score, baseDps } = data;
    const equipListLength = MISC[cache.gameId].maxEquips;
    const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);

    advanceTrial = createAdvanceTrial(cache, evaluateEquipMap);

    trials = Array.from({ length: 250 }, () => ({
      equipList: new Array(equipListLength).fill(null),
      summary,
      score,
      dps: baseDps,
    }));

    self.postMessage({ type: 'ready' });
    return;
  }

  if (data.type === 'advance') {
    for (const trial of trials) {
      advanceTrial(trial);
    }

    self.postMessage({
      type: 'mean',
      mean: mean(trials.map((trial) => trial.dps)),
    });
  }
};
