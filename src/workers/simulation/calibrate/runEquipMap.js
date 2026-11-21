import { getTotals, toMergedObj } from '@/utils';

function runEquipMap(preMerged, equipMap, resolveSnapshots, partWeights, baseRates, durationGetter) {
  const statMap = toMergedObj(preMerged, equipMap);

  const snapshots = resolveSnapshots(statMap);
  const totals = getTotals(snapshots);

  const fullScore = partWeights.reduce((acc, [part, weight]) => {
    const value = totals[part] ?? 0;
    const divisor = baseRates?.[part] || 1;

    return acc + value / divisor * weight;
  }, 0);

  const time = durationGetter(equipMap);

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
}

export function createRunEquipMap(preMerged, resolveSnapshots, durationGetter, calibration) {
  const { reference, ...weights } = calibration;
  const partWeights = Object.entries(weights).filter(Boolean);

  return (equipMap = {}) => runEquipMap(preMerged, equipMap, resolveSnapshots, partWeights, reference, durationGetter);
}
