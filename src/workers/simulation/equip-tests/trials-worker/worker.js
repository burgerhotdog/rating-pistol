import { mean } from 'simple-statistics';
import { MISC, SUBSTAT } from '@/data';
import { buildEquipMap, buildSkippable, getMainstatConfigKey, sumSubstatRolls } from '@/utils';
import { createEvaluateEquipMap } from '../evaluateEquipMap';
import { createAdvanceTrial } from './advance';

const NUM_TRIALS = 250;
const NUM_TRIALS_QUICK = 75;

const NUM_DAYS = 100;
const NUM_DAYS_QUICK = 30;

let cache;
let gameId;
let evaluateEquipMap;
let trials;

function initTrials(numTrials) {
  const { maxEquips } = MISC[cache.gameId];
  const { snapshots, score } = evaluateEquipMap();

  return Array.from({ length: numTrials }, () => ({
    equipList: new Array(maxEquips).fill(null),
    snapshots,
    score,
  }));
}

function runTrials(numDays, currId) {
  const { score } = evaluateEquipMap();
  const skippable = buildSkippable(gameId, score, evaluateEquipMap);
  const advanceTrial = createAdvanceTrial(cache, evaluateEquipMap, currId, skippable);

  for (let day = 1; day <= numDays; day++) {
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

function reportMeanEquipMap() {
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

function reportEquipListConfigs() {
  const substatKeys = Object.keys(SUBSTAT[gameId]);

  const initConfig = () => ({
    trialCount: 0,
    substatRolls: Object.fromEntries(
      substatKeys.map((stat) => [stat, []])
    ),
  });

  const equipListConfigs = {};

  for (const trial of trials) {
    const configKey = getMainstatConfigKey(gameId, trial.equipList);
    const config = equipListConfigs[configKey] ??= initConfig();

    config.trialCount++;
    const substatRolls = sumSubstatRolls(gameId, trial.equipList, true);
    for (const stat in config.substatRolls) {
      const rolls = config.substatRolls[stat];
      rolls.push(substatRolls[stat] ?? 0);
    }
  }

  self.postMessage({ type: 'equipListConfigs', equipListConfigs });
}

self.onmessage = ({ data }) => {
  const { equipMaps, currId, quick } = data;

  const numTrials = quick ? NUM_TRIALS_QUICK : NUM_TRIALS;
  const numDays = quick ? NUM_DAYS_QUICK : NUM_DAYS;

  cache = data.cache;
  gameId = cache.gameId;
  evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  trials = initTrials(numTrials);

  runTrials(numDays, currId);

  if (quick) {
    reportMeanEquipMap();
  } else {
    reportEquipListConfigs();
  }
};
