import { computeConcertoExtraTime, computeEnergyPenalty, getTotals } from '@/utils';
import { runRotation } from './rotation';

export function runVariantDps(cache, equipMaps, charId, options = {}) {
  const mCache = cache.member[charId];
  const {
    memberOverride,
    sourceStatMap = mCache.statMap,
    testStatMap = memberOverride?.statMap ?? mCache.statMap,
  } = options;

  const variantMCache = {
    ...mCache,
    ...(memberOverride && memberOverride),
  };

  const variantCache = {
    ...cache,
    ...(memberOverride && {
      member: {
        ...cache.member,
        [charId]: variantMCache,
      },
    }),
  };

  const concertoExtraTime = computeConcertoExtraTime(variantMCache);
  const snapshots = runRotation(variantCache, equipMaps);
  const rawDps = getTotals(snapshots).damage / (cache.rotationDuration + concertoExtraTime) * 1000;

  const penalty = mCache.energy
    ? computeEnergyPenalty(cache.gameId, cache.rotationDuration, mCache.duration, mCache.energyReq, testStatMap)
    : 1;

  return rawDps * penalty;
}
