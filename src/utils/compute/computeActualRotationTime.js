import { getEnergyLevel } from '../getEnergyLevel';
import { toMergedObj } from '../merge';

export function computeActualRotationTime(cache, equipMaps) {
  let fullTime = 0;

  for (const mCache of Object.values(cache.member)) {
    if (mCache.concertoPenalty) {
      fullTime += 2000;
    }

    if (!mCache.energy) {
      fullTime += mCache.duration;
      continue;
    }

    const statMap = toMergedObj(mCache.baseMap, mCache.staticMap, equipMaps[mCache.id]);
    const energyLevel = getEnergyLevel(cache.gameId, statMap);

    if (energyLevel - mCache.energyReq >= 0) {
      fullTime += mCache.duration;
      continue;
    }

    fullTime += mCache.energyReq / energyLevel * mCache.duration;
  }

  return fullTime;
}
