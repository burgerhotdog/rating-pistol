import {
  GI, HSR, WW, ZZZ,
  CHARACTER,
} from '@/data';
import {
  getAttr, getTotals,
  toArray, toMergedObj,
} from '@/utils';

const ENERGY_ATTR = {
  [GI]: 'energyRecharge%',
  [HSR]: 'energyRegenerationRate%',
  [WW]: 'energyRegen%',
  [ZZZ]: 'energyRegen%',
};

const penaltyMult = (current, target) => {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-relativeDeficit);
};

export function createEvaluateEquipMap(cache, evalId, summarySpecs) {
  const { gameId, rotationDuration } = cache;
  const erAttrId = ENERGY_ATTR[gameId];
  const needsEnergy = !CHARACTER[gameId][evalId].noEnergy;

  const { duration: charRotDur, baseMap, statMap } = cache.member[evalId];
  const originalEr = getAttr(erAttrId, statMap);

  function getPenalty(testMap) {
    if (!needsEnergy) return 1;
    const newEr = getAttr(erAttrId, testMap);
    if (newEr >= originalEr) return 1;

    const newCharRotDur = charRotDur * (originalEr / newEr);
    const durPenalty = newCharRotDur - charRotDur;
    return rotationDuration / (rotationDuration + durPenalty);
  }

  return (equipMap = {}) => {
    const statMap = toMergedObj(baseMap, equipMap);
    const penalty = getPenalty(statMap);

    const summary = summarySpecs(statMap);
    const totals = getTotals(summary);
    const baseScore = Object.values(totals)
      .reduce((acc, value) => acc + value, 0);
    const score = baseScore * penalty;

    return { summary, totals, score };
  };
}
