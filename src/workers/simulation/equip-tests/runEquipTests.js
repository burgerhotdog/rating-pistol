import { linearRegression } from 'simple-statistics';
import { runTrials } from './runTrials';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { testExtraSubstat } from './testExtraSubstat';

const getFit = (mpsProgression, mpsCeiling) => {
  const logPoints = mpsProgression
    .slice(-5)
    .map(({ day, mean }) => [
      Math.log(day),
      Math.log(mpsCeiling - mean),
    ]);

  const { m, b } = linearRegression(logPoints);

  return { k: -m, A: Math.exp(b) };
};

export async function runEquipTests(cache, equipMaps, currId, calibration, scoreCeiling) {
  const { scoreUpdates, dpsUpdates, equipListConfigs } = await runTrials(cache, equipMaps, currId, true, calibration);

  const evaluateEquipMap = createEvaluateEquipMap(cache, equipMaps, currId, calibration);
  const { score, dps } = evaluateEquipMap();
  const { score: userScore } = evaluateEquipMap(equipMaps[currId]);

  const scoreProgression = [{ day: 0, mean: score }, ...scoreUpdates];
  const dpsProgression = [{ day: 0, mean: dps }, ...dpsUpdates];

  const extraSubstatsResults = testExtraSubstat(cache, equipMaps, currId, evaluateEquipMap);

  return {
    scoreProgression,
    dpsProgression,
    userScore,
    fit: getFit(scoreProgression, scoreCeiling),
    equipListConfigs,
    extraSubstats: extraSubstatsResults.results,
    extraSubstatsControl: extraSubstatsResults.control,
  };
}
