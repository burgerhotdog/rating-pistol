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
  const mCache = cache.member[evalId];
  const evalRotationSpecs = runRotation(cache, equipMaps, evalId);

  const evalHealing = mCache.healing;
  const evalShield = mCache.shield;
  function baseScore(testTotals) {
    const { damage, healing, shield } = testTotals;
    let baseScore = damage;
    if (evalHealing) baseScore += healing;
    if (evalShield) baseScore += shield;
    return baseScore;
  }

  const energyAttr = ENERGY_ATTR[cache.gameId];
  const energyReq = getAttr(energyAttr, mCache.statMap ?? mCache.baseMap);
  function energyPenalty(testStatMap) {
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
    const score = baseScore(totals) * energyPenalty(evalStatMap);

    return { summary, totals, score };
  };
}
