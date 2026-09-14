import { GI } from '@/data';
import { runRotation } from '../rotation';
import { getTotals, toMergedObj, computeActualRotationTime } from '@/utils';

export function createEvaluateEquipMap(cache, equipMaps, evalId) {
  const { gameId } = cache;
  const mCache = cache.member[evalId];
  const snapshotSpecs = runRotation(cache, equipMaps, evalId);

  const resonanceMap = gameId === GI
    ? cache.elementalResonance.stats
    : {};

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(mCache.baseMap, mCache.staticMap, evalEquipMap, resonanceMap);

    const snapshots = snapshotSpecs(evalStatMap);
    const totals = getTotals(snapshots);
    const actualRotationTime = computeActualRotationTime(cache, { ...equipMaps, [evalId]: evalEquipMap });
    const score = (totals.damage + totals.healing + totals.shield) / actualRotationTime * 1000;

    return { snapshots, totals, score, actualRotationTime };
  };
}
