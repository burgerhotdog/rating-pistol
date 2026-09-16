import { GI } from '@/data';
import { getEnergyLevel } from '../getEnergyLevel';
import { toMergedObj } from '../merge';

export function computeActualRotationTime(cache, equipMaps, showSource = false) {
  const { gameId } = cache;
  const source = {};
  let fullTime = 0;

  for (const mCache of Object.values(cache.member)) {
    const mSource = source[mCache.id] = { duration: mCache.duration, added: 0 };

    if (mCache.concertoPenalty) {
      mSource.added += 2000;
      fullTime += 2000;
    }

    if (!mCache.energy) {
      fullTime += mCache.duration;
      continue;
    }

    const toMerge = [mCache.baseMap, mCache.staticMap, equipMaps[mCache.id]];
    if (gameId === GI) {
      toMerge.push(cache.elementalResonance.stats);
    }

    const statMap = toMergedObj(...toMerge);
    const energyLevel = getEnergyLevel(gameId, statMap);

    if (energyLevel - mCache.energyReq >= 0) {
      fullTime += mCache.duration;
      continue;
    }

    const deficit = 1 - energyLevel / mCache.energyReq;
    fullTime += mCache.duration * Math.exp(deficit);
    mSource.added += mCache.duration * Math.exp(deficit);
  }

  if (!showSource) return fullTime;

  return { time: fullTime, source };
}
