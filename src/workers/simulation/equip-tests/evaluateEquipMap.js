import { GI } from '@/data';
import { runRotation } from '../rotation';
import { getTotals, toMergedObj, computeActualRotationTime } from '@/utils';

export function createEvaluateEquipMap(cache, equipMaps, evalId) {
  const { gameId } = cache;
  const mCache = cache.member[evalId];
  const snapshotSpecs = runRotation(cache, equipMaps, evalId);

  const toMerge = [mCache.baseMap, mCache.staticMap];
  if (gameId === GI) {
    toMerge.push(cache.elementalResonance.stats);
  }
  const preMerged = toMergedObj(...toMerge);

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(preMerged, evalEquipMap);

    const snapshots = snapshotSpecs(evalStatMap);
    const totals = getTotals(snapshots);
    const { time } = computeActualRotationTime(cache, { ...equipMaps, [evalId]: evalEquipMap });
    const score = (totals.damage + totals.healing + totals.shield) / time * 1000;

    return { snapshots, totals, score, actualRotationTime: time };
  };
}
