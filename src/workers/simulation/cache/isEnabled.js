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

export const isEnabled = (effect, spec) => {
  const { type, data, rank } = spec;

  const hasEnableIf = Object.keys(effect)
    .some((field) => field.startsWith('enableIf'));
  if (!hasEnableIf) return true;

  switch (type) {
    case 'character':
      return (
        ifElement(effect.enableIfElement, data) ||
        ifWeaponType(effect.enableIfWeaponType, data) ||
        ifTagged(effect.enableIfTagged, data) ||
        ifRankMin(effect.enableIfRankMin, rank) || 
        ifRankMax(effect.enableIfRankMax, rank)
      );
    case 'weapon':
      return true;
    case 'set':
      return ifTagged(effect.enableIfTagged, data);
  }
};
