import { GI } from '@/data';
import { runRotation } from '../rotation';
import { getTotals, toMergedObj } from '@/utils';
import { createEquipDurationGetter } from '../duration';

export function createEvaluateEquipMap(cache, equipMaps, evalId) {
  const { gameId } = cache;
  const mCache = cache.member[evalId];
  const { snapshots: snapshotSpecs, bonusEnergy } = runRotation(cache, equipMaps, evalId);

  const toMerge = [mCache.baseMap, mCache.staticMap];
  if (gameId === GI) {
    toMerge.push(cache.teamResonance.stats);
  }
  const preMerged = toMergedObj(...toMerge);

  const durationGetter = createEquipDurationGetter(cache, equipMaps, evalId, bonusEnergy);

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(preMerged, evalEquipMap);

    const snapshots = snapshotSpecs(evalStatMap);
    const totals = getTotals(snapshots);
    const { time } = durationGetter(evalEquipMap);
    const score = totals.damage / time * 1000;

    return { snapshots, totals, score, actualRotationTime: time };
  };
}
