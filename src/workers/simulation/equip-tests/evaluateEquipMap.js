import { GI } from '@/data';
import { runRotation } from '../rotation';
import { getTotals, toMergedObj } from '@/utils';
import { createEquipDurationGetter } from '../duration';

export function createEvaluateEquipMap(cache, equipMaps, evalId, calibration = { damage: 1 }) {
  const { gameId } = cache;
  const mCache = cache.member[evalId];
  const { snapshots: snapshotSpecs, bonusEnergy } = runRotation(cache, equipMaps, evalId);

  const toMerge = [mCache.baseMap, mCache.staticMap];
  if (gameId === GI) {
    toMerge.push(cache.teamResonance.stats);
  }
  const preMerged = toMergedObj(...toMerge);

  const durationGetter = createEquipDurationGetter(cache, equipMaps, evalId, bonusEnergy);

  const { reference, ...weights } = calibration;
  const partWeights = Object.entries(weights);

  return (evalEquipMap = {}) => {
    const evalStatMap = toMergedObj(preMerged, evalEquipMap);
    const snapshots = snapshotSpecs(evalStatMap);

    const totals = getTotals(snapshots);

    const fullScore = partWeights.reduce((acc, [part, weight]) => {
      const value = totals[part] ?? 0;
      const divisor = reference?.[part] ?? 1;

      return acc + value / divisor * weight;
    }, 0);

    const { time } = durationGetter(evalEquipMap);
    const score = fullScore / time * 1000;

    const dps = totals.damage / time * 1000;

    return {
      snapshots,
      totals,
      fullScore,
      score,
      actualRotationTime: time,
      dps,
    };
  };
}
