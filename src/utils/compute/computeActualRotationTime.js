import { GI } from '@/data';
import { getEnergyLevel } from '../getEnergyLevel';
import { toMergedObj } from '../merge';

export function computeActualRotationTime(cache, equipMaps) {
  const { gameId } = cache;
  const source = {};
  let fullTime = 0;

  for (const mCache of Object.values(cache.member)) {
    const mSource = source[mCache.id] = { duration: mCache.duration, added: 0 };

    if (mCache.concertoPenalty) {
      mSource.added += 3000;
      fullTime += 3000;
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
    const testErValue = getEnergyLevel(gameId, statMap);
    const reqErValue = mCache.energyReq;

    if (testErValue >= reqErValue) {
      fullTime += mCache.duration;
      continue;
    }

    const addedTime = (1 - (testErValue / reqErValue)) * mCache.energy * 150;

    fullTime += mCache.duration + addedTime;
    mSource.added += addedTime;
  }

  return { time: fullTime, source };
}
