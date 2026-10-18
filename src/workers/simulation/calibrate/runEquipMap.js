import { GI } from '@/data';
import { getTotals, toMergedObj } from '@/utils';
import { runRotation } from '../rotation';
import { createEquipDurationGetter } from '../duration';

export function createRunEquipMapFactory(cache, equipMaps, specId) {
  const { gameId } = cache;

  const preMerged = toMergedObj(...[
    cache.member[specId].baseMap,
    cache.member[specId].staticMap,
    ...(gameId === GI ? [cache.teamResonance.stats] : []),
  ]);

  const { snapshots: resolveSnapshots, bonusEnergy } = runRotation(cache, equipMaps, specId);

  const durationGetter = createEquipDurationGetter(cache, equipMaps, specId, bonusEnergy);

  return (calibration = { damage: 1 }) => {
    const { reference, ...weights } = calibration;
    const partWeights = Object.entries(weights);

    return (equipMap = {}) => {
      const statMap = toMergedObj(preMerged, equipMap);
      const snapshots = resolveSnapshots(statMap);
      const totals = getTotals(snapshots);

      const fullScore = partWeights.reduce((acc, [part, weight]) => {
        const value = totals[part] ?? 0;
        const divisor = reference?.[part] ?? 1;

        return acc + value / divisor * weight;
      }, 0);

      const { time } = durationGetter(equipMap);

      const score = fullScore / time * 1000;
      const dps = totals.damage / time * 1000;

      return {
        snapshots,
        totals,
        fullScore,
        time,
        score,
        dps,
      };
    };
  }
}
