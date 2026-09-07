import { runRotation } from '../rotation';
import { getTotals, toMergedObj, computeActualRotationTime } from '@/utils';

export function createEvaluateEquipMap(cache, equipMaps, evalId) {
  const mCache = cache.member[evalId];
  const snapshotSpecs = runRotation(cache, equipMaps, evalId);

  function baseScore(testTotals) {
    const { damage, healing, shield } = testTotals;

    let baseScore = damage;
    if (mCache.healing) baseScore += healing;
    if (mCache.shield) baseScore += shield;

    return baseScore;
  }
  
  const actualRotationTime = computeActualRotationTime(cache, equipMaps);

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(mCache.baseMap, evalEquipMap);

    const snapshots = snapshotSpecs(evalStatMap);
    const totals = getTotals(snapshots);
    const score = baseScore(totals) / actualRotationTime * 1000;

    return { snapshots, totals, score, actualRotationTime };
  };
}
