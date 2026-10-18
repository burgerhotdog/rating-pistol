import { runTrials } from './runTrials';
import { createEvaluateEquipMap } from './evaluateEquipMap';
import { testExtraSubstat } from './testExtraSubstat';

export async function runEquipTests(cache, equipMaps, currId, calibration) {
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
    equipListConfigs,
    extraSubstats: extraSubstatsResults.results,
    extraSubstatsControl: extraSubstatsResults.control,
  };
}
