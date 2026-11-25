import { getTotals } from '@/utils';
import { runRotation } from '../rotation';
import { getTestOrders, withRotationOrder } from '../rotation-order';

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
  const time = durationGetter(variantCache, bonusEnergy, equipMaps);
  const totals = getTotals(snapshots);
  return totals.damage / time * 1000;
}

export function runBestVariantDps(cache, equipMaps, charId, memberOverride, durationGetter) {
  let bestDps = -Infinity;

  for (const order of getTestOrders(cache.gameId, cache.memberIds)) {
    const orderCache = withRotationOrder(cache, order);
    const dps = runVariantDps(orderCache, equipMaps, charId, memberOverride, durationGetter);

    if (dps > bestDps) {
      bestDps = dps;
    }
  }

  return bestDps;
}
