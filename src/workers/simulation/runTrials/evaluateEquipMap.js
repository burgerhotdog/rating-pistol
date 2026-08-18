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
  const energyAttr = ENERGY_ATTR[cache.gameId];
  const mCache = cache.member[evalId];

  const energyReq = getAttr(energyAttr, mCache.statMap ?? mCache.baseMap);
  const evalRotationSpecs = runRotation(cache, equipMaps, evalId);

  function getPenalty(testStatMap) {
    if (!mCache.energy) return 1; // no energy req

    const testEnergy = getAttr(energyAttr, testStatMap);
    if (testEnergy >= energyReq) return 1; // energy req passed

    const testCharDuration = mCache.duration * (energyReq / testEnergy);
    const addedTime = testCharDuration - mCache.duration;
    return cache.rotationDuration / (cache.rotationDuration + addedTime);
  }

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(mCache.baseMap, evalEquipMap);

    const summary = evalRotationSpecs(evalStatMap);
    const totals = getTotals(summary);
    const score = (totals.damage + totals.healing + totals.shield) * getPenalty(evalStatMap);

    return { summary, totals, score };
  };
}
