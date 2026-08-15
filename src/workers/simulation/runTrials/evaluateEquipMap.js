import { GI, HSR, WW, ZZZ } from '@/data';
import { runRotation } from '../rotation';
import { getAttr, getTotals, toMergedObj } from '@/utils';

const ENERGY_ATTR = {
  [GI]: 'energyRecharge%',
  [HSR]: 'energyRegenerationRate%',
  [WW]: 'energyRegen%',
  [ZZZ]: 'energyRegen%',
};

export function createEvaluateEquipMap(cache, equipMaps, evalId) {
  const rotationSpecs = runRotation(cache, equipMaps, evalId);

  const { gameId, rotationDuration } = cache;
  const erAttrId = ENERGY_ATTR[gameId];

  const { duration: charRotDur, baseMap, statMap, noEnergy } = cache.member[evalId];
  const originalEr = getAttr(erAttrId, statMap);

  function getPenalty(testMap) {
    if (noEnergy) return 1;

    const newEr = getAttr(erAttrId, testMap);
    if (newEr >= originalEr) return 1;

    const newCharRotDur = charRotDur * (originalEr / newEr);
    const durPenalty = newCharRotDur - charRotDur;
    return rotationDuration / (rotationDuration + durPenalty);
  }

  return (equipMap = {}) => {
    const statMap = toMergedObj(baseMap, equipMap);
    const penalty = getPenalty(statMap);

    const summary = rotationSpecs(statMap);
    const totals = getTotals(summary);
    const baseScore = Object.values(totals)
      .reduce((acc, value) => acc + value, 0);
    const score = baseScore * penalty;

    return { summary, totals, score };
  };
}
