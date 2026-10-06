import { getTotals } from '@/utils';
import { runRotation } from '../rotation';

export function runVariantDps(cache, equipMaps, charId, memberOverride, durationGetter) {
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

  const { snapshots, bonusEnergy } = runRotation(variantCache, equipMaps);
  const { time } = durationGetter(variantCache, bonusEnergy);
  const totals = getTotals(snapshots);
  return (totals.damage + totals.healing + totals.shield) / time * 1000;
}
