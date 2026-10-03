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

  const requiredEr = energy * er / (energy - flat - erScaled * er);

  return clamp(requiredEr, energyMin, energyMax);
}

function getRequiredErMap(cache, equipMaps, bonusEnergy) {
  const { gameId } = cache;
  const requiredErMap = {};

  for (const memberId in cache.member) {
    const { energy } = CHARACTER[gameId][memberId];
    if (!energy) continue;

    requiredErMap[memberId] = getRequiredEr(cache, memberId, equipMaps[memberId], bonusEnergy);
  }

  return requiredErMap;
}

// Member ids from for...in are strings, so compare against the numeric member.id
function resolveDuration(cache, equipMaps, requiredErMap, bonusEnergy, specId, specEquipMap) {
  const { gameId } = cache;
  const source = {};
  let fullTime = 0;

  for (const memberId in cache.member) {
    const { id, duration, concertoPenalty } = cache.member[memberId];
    const mSource = source[memberId] = { duration, added: 0 };
    fullTime += duration;

    const { energy } = CHARACTER[gameId][memberId];
    if (!energy) continue;

    if (gameId === WW && concertoPenalty) {
      mSource.added += 3000;
      fullTime += 3000;
    }

    const equipMap = id === specId
      ? specEquipMap
      : equipMaps[memberId];

    const statMap = getStatMap(cache, memberId, equipMap);
    const testEr = getEnergyLevel(gameId, statMap);
    const requiredEr = requiredErMap[memberId];

    const { flat = 0, erScaled = 0 } = bonusEnergy[memberId] ?? {};

    const energyPerEr = energy / requiredEr;
    const generated = (energyPerEr + erScaled) * testEr + flat;

    const missingEnergy = Math.max(0, energy - generated);
    const addedTime = missingEnergy * 150;

    mSource.added += addedTime;
    fullTime += addedTime;
  }

  return { time: fullTime, source };
}

// Resolves immediately for the given cache and equipMaps
export function computeDuration(cache, equipMaps, bonusEnergy = {}) {
  const requiredErMap = getRequiredErMap(cache, equipMaps, bonusEnergy);
  return resolveDuration(cache, equipMaps, requiredErMap, bonusEnergy);
}

// Returns a function that resolves for a varying equipMap on specId
export function createEquipDurationGetter(cache, equipMaps, specId, bonusEnergy = {}) {
  const requiredErMap = getRequiredErMap(cache, equipMaps, bonusEnergy);

  return (testEquipMap) => resolveDuration(
    cache, equipMaps, requiredErMap, bonusEnergy, specId, testEquipMap,
  );
}

// Returns a function that resolves for a varying cache and bonusEnergy.
// Required ER is fixed by the baseline cache, so variants are penalized against it.
export function createVariantDurationGetter(cache, equipMaps, bonusEnergy = {}) {
  const requiredErMap = getRequiredErMap(cache, equipMaps, bonusEnergy);

  return (variantCache, variantBonusEnergy = bonusEnergy) => resolveDuration(
    variantCache, equipMaps, requiredErMap, variantBonusEnergy,
  );
}
