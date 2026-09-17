import { linearRegression } from 'simple-statistics';
import { buildSkippable } from '@/utils';
import { runTrials } from './runTrials';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { computeCeiling } from './computeCeiling';

export async function runEquipTests(cache, equipMaps, currId) {
  const { gameId } = cache;

  const { mpsUpdates, equipListConfigs } = await runTrials(cache, equipMaps, currId, true);

  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId);
  const { score } = evaluateEquipMap();
  const skippable = buildSkippable(gameId, score, evaluateEquipMap);
  const mpsCeiling = computeCeiling(gameId, evaluateEquipMap, currId, skippable);

  const mpsProgression = [{ day: 0, mean: score }, ...mpsUpdates];

  const logPoints = mpsProgression
    .slice(-5)
    .map(({ day, mean }) => [
      Math.log(day),
      Math.log(mpsCeiling - mean),
    ]);

  const { m, b } = linearRegression(logPoints);
  const fit = { k: -m, A: Math.exp(b) };

  return {
    dpsProgression: mpsProgression,
    dpsCeiling: mpsCeiling,
    fit,
    equipListConfigs,
  };
}
