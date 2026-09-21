import { computeActualRotationTime, getTotals } from '@/utils';
import { runRotation } from '../rotation';

export function runVariantDps(cache, equipMaps, charId, memberOverride) {
  const variantCache = {
    ...cache,
    member: {
      ...cache.member,
      [charId]: {
        ...cache.member[charId],
        ...memberOverride,
      },
    },
  };

  const snapshots = runRotation(variantCache, equipMaps);
  const { time } = computeActualRotationTime(variantCache, equipMaps);
  const totals = getTotals(snapshots);
  return (totals.damage + totals.healing + totals.shield) / time * 1000;
}
