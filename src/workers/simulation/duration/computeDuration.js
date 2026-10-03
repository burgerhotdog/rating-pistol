import { CHARACTER, GI, WW } from '@/data';
import { clamp, getEnergyLevel, toMergedObj } from '@/utils';

function getStatMap(cache, memberId, equipMap) {
  const {
    gameId,
    member: {
      [memberId]: { baseMap, staticMap },
    },
  } = cache;

  return toMergedObj(
    baseMap,
    staticMap,
    equipMap,
    ...(gameId === GI ? [cache.elementalResonance.stats] : []),
  );
}

function getRequiredEr(cache, memberId, equipMap, bonusEnergy = {}) {
  const { gameId } = cache;
  const { energy, energyMin = 1, energyMax = Infinity } = CHARACTER[gameId][memberId];

  const statMap = getStatMap(cache, memberId, equipMap);
  const er = getEnergyLevel(gameId, statMap);

  const {flat = 0, erScaled = 0 } = bonusEnergy[memberId] ?? {};

  const requiredEr =
    energy * er /
    (energy - flat - erScaled * er);

  return clamp(requiredEr, energyMin, energyMax);
}

export function computeDuration(cache, equipMaps, bonusEnergy = {}, specId) {
  const { gameId } = cache;

  const requiredErMap = {};

  for (const memberId in cache.member) {
    const { energy } = CHARACTER[gameId][memberId];
    if (!energy) continue;

    requiredErMap[memberId] = getRequiredEr(
      cache,
      memberId,
      equipMaps[memberId],
      bonusEnergy,
    );
  }

  function resolve(testEquipMap, testBonusEnergy = bonusEnergy) {
    const source = {};
    let fullTime = 0;

    for (const memberId in cache.member) {
      const { duration, concertoPenalty } = cache.member[memberId];
      const mSource = source[memberId] = { duration, added: 0 };
      fullTime += duration;

      const { energy } = CHARACTER[gameId][memberId];
      if (!energy) continue;

      if (gameId === WW && concertoPenalty) {
        mSource.added += 3000;
        fullTime += 3000;
      }

      const equipMap = memberId === specId
        ? testEquipMap
        : equipMaps[memberId];

      const statMap = getStatMap(cache, memberId, equipMap);
      const testEr = getEnergyLevel(gameId, statMap);
      const requiredEr = requiredErMap[memberId];

      const { flat = 0, erScaled = 0 } = testBonusEnergy[memberId] ?? {};

      const energyPerEr = energy / requiredEr;
      const generated =
        (energyPerEr + erScaled) * testEr
        + flat;

      const missingEnergy = Math.max(0, energy - generated);
      const addedTime = missingEnergy * 150;

      mSource.added += addedTime;
      fullTime += addedTime;
    }

    return { time: fullTime, source };
  }

  return specId === undefined ? resolve() : resolve;
}