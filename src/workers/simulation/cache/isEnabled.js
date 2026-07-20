import { toArray } from '@/utils';

const ifElement = (rawFilter, character) => {
  const filter = toArray(rawFilter);
  return filter.some((element) => element === character.element);
};

const ifWeaponType = (rawFilter, character) => {
  const filter = toArray(rawFilter);
  return filter.some((type) => type === character.type);
};

const ifTagged = (rawFilter, character) => {
  const filter = toArray(rawFilter);
  const charTagged = toArray(character.tagged);
  return filter.some((tag) => charTagged.includes(tag));
};

const ifRankMin = (minRank, rank) => {
  return rank >= minRank;
};

const ifRankMax = (maxRank, rank) => {
  return rank <= maxRank;
};

const ifNoEnergy = (effect, character) => {
  if ('ifNoEnergy' in effect) {
    return character.noEnergy;
  }
};

export const isEnabled = (effect, spec) => {
  const { gameId, type, rank, character } = spec;

  const hasEnableIf = Object.keys(effect)
    .some((field) => field.startsWith('enableIf'));
  if (!hasEnableIf) return true;

  switch (type) {
    case 'character':
      return (
        ifElement(effect.enableIfElement, character) ||
        ifWeaponType(effect.enableIfWeaponType, character) ||
        ifTagged(effect.enableIfTagged, character) ||
        ifRankMin(effect.enableIfRankMin, rank) || 
        ifRankMax(effect.enableIfRankMax, rank) ||
        ifNoEnergy(effect, character)
      );
    case 'weapon':
      return true;
    case 'set':
      return (
        ifWeaponType(effect.enableIfWeaponType, character) ||
        ifTagged(effect.enableIfTagged, character) ||
        ifNoEnergy(effect, character)
      );
  }
};
