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
    ...(gameId === GI ? [cache.teamResonance.stats] : []),
  );
}

// Memoized stat map lookup for any member, using the equip map chosen by getEquipMap
function createStatMapLookup(cache, getEquipMap) {
  const memo = {};
  return (memberId) => memo[memberId] ??= getStatMap(cache, memberId, getEquipMap(memberId));
}

// Crit scaled entries are weighted by the crit rate of the member who triggered them
function resolveBonusEnergy(memberBonusEnergy, statMapOf) {
  if (!memberBonusEnergy) return { flat: 0, erScaled: 0 };

  let { flat, erScaled } = memberBonusEnergy;

  for (const entry of memberBonusEnergy.critScaled) {
    const ownerStatMap = statMapOf(entry.ownerId);
    const critRate = clamp((ownerStatMap['critRate%'] ?? 0) + (entry.buffMap['critRate%'] ?? 0), 0, 1);
    const mult = 1 - ((1 - critRate) ** 2);
    flat += entry.flat * mult;
    erScaled += entry.erScaled * mult;
  }

  return { flat, erScaled };
}

function getRequiredEr(cache, memberId, statMapOf, bonusEnergy = {}) {
  const { gameId } = cache;
  const { energy, energyMin = 1, energyMax = Infinity } = CHARACTER[gameId][memberId];

  const er = getEnergyLevel(gameId, statMapOf(memberId));

  const { flat, erScaled } = resolveBonusEnergy(bonusEnergy[memberId], statMapOf);

  const requiredEr = energy * er / (energy - flat - erScaled * er);

  return clamp(requiredEr, energyMin, energyMax);
}

function getRequiredErMap(cache, equipMaps, bonusEnergy) {
  const { gameId } = cache;
  const requiredErMap = {};
  const statMapOf = createStatMapLookup(cache, (id) => equipMaps[id]);

  for (const memberId in cache.member) {
    const { energy } = CHARACTER[gameId][memberId];
    if (!energy) continue;

    requiredErMap[memberId] = getRequiredEr(cache, memberId, statMapOf, bonusEnergy);
  }

  return requiredErMap;
}

function resolveDuration(cache, equipMaps, requiredErMap, bonusEnergy, specId, specEquipMap) {
  const { gameId } = cache;
  const source = {};
  let fullTime = 0;
  const statMapOf = createStatMapLookup(cache, (id) => id === specId ? specEquipMap : equipMaps[id]);

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

    const testEr = getEnergyLevel(gameId, statMapOf(id));
    const requiredEr = requiredErMap[memberId];

    const { flat, erScaled } = resolveBonusEnergy(bonusEnergy[memberId], statMapOf);

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
