import { mean } from 'simple-statistics';
import { MISC } from '@/data';
import { buildEquipListConfigs, buildEquipMap } from '@/utils';
import { createEvaluateEquipMap } from '../evaluateEquipMap';
import { createAdvanceTrial } from './advance';

const NUM_TRIALS = 250;
const NUM_TRIALS_QUICK = 75;

let gameId;
let trials;
let advanceTrial;

function handleInit(data) {
  const { cache, equipMaps, currId, snapshots, score, skippable, quick } = data;

  gameId = cache.gameId;

  const { maxEquips } = MISC[gameId];

  trials = Array.from(
    { length: quick ? NUM_TRIALS_QUICK : NUM_TRIALS },
    () => ({
      equipList: new Array(maxEquips).fill(null),
      snapshots,
      score,
    }),
  );

  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);

  advanceTrial = createAdvanceTrial(cache, evaluateEquipMap, currId, skippable);

  self.postMessage({ type: 'ready' });
}

function handleRun(maxDay) {
  for (let day = 1; day <= maxDay; day++) {
    for (const trial of trials) {
      advanceTrial(trial);
    }

    self.postMessage({
      type: 'progress',
      day,
      mean: mean(trials.map((trial) => trial.score)),
    });
  }
}

function handleEquipMap() {
  const meanEquipMap = {};

  for (const trial of trials) {
    const equipMap = buildEquipMap(trial.equipList, true);

    for (const stat in equipMap) {
      const value = equipMap[stat] / trials.length;
      meanEquipMap[stat] = (meanEquipMap[stat] ?? 0) + value;
    }
  }

  self.postMessage({ type: 'meanEquipMap', meanEquipMap });
}

function handlePartialConfigs() {
  const equipListConfigs = buildEquipListConfigs(gameId, trials);
  self.postMessage({ type: 'equipListConfigs', equipListConfigs });
}

self.onmessage = ({ data }) => {
  const { type, maxDay } = data;

  if (type === 'init') {
    handleInit(data);
  }

  if (type === 'run') {
    handleRun(maxDay);

    if (maxDay === 30) {
      handleEquipMap();
    } else {
      handlePartialConfigs();
    }
  }
};
