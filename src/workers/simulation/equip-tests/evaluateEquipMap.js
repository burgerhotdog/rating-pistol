import { runRotation } from '../rotation';
import { getTotals, toMergedObj, computeActualRotationTime } from '@/utils';

export function createEvaluateEquipMap(cache, equipMaps, evalId) {
  const mCache = cache.member[evalId];
  const snapshotSpecs = runRotation(cache, equipMaps, evalId);

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(mCache.baseMap, mCache.staticMap, evalEquipMap);

    const snapshots = snapshotSpecs(evalStatMap);
    const totals = getTotals(snapshots);
    const actualRotationTime = computeActualRotationTime(cache, { ...equipMaps, [evalId]: evalEquipMap });
    const score = (totals.damage + totals.healing + totals.shield) / actualRotationTime * 1000;

    return { snapshots, totals, score, actualRotationTime };
  };
}
