import { linearRegression } from 'simple-statistics';
import { buildSkippable } from '@/utils';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { computeCeiling } from './computeCeiling';
import { runContinuous } from './runContinuous';

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
