import { computeActualRotationTime, getTotals } from '@/utils';
import { runRotation } from './rotation';

export function getMps(cache, equipMaps, snapshots, include = ['damage']) {
  const finalSnapshots = snapshots ?? runRotation(cache, equipMaps);
  const totals = getTotals(finalSnapshots);

  let motion = 0;
  for (const part in totals) {
    if (!include.includes(part)) continue;

    motion += totals[part];
  }

  const { time } = computeActualRotationTime(cache, equipMaps);

  return motion / time * 1000;
}
