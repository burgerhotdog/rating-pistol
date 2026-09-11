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
  const actualRotationTime = computeActualRotationTime(variantCache, equipMaps);
  return getTotals(snapshots).damage / actualRotationTime * 1000;
}
