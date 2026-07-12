import { toArray } from '@/utils';

const ifElement = (filter, character) =>
  toArray(filter).some((filterElement) =>
    filterElement === character.element);

const ifWeaponType = (filter, character) =>
  toArray(filter).some((weaponType) =>
    weaponType === character.type);

const ifTagged = (filter, character) =>
  toArray(filter).some((tag) =>
    toArray(character.tagged).includes(tag));

export const enableIf = (effect, character) => {
  const hasEnableIf =
    'enableIfElement' in effect ||
    'enableIfWeaponType' in effect ||
    'enableIfTagged' in effect;

  return !hasEnableIf ||
    ifElement(effect.enableIfElement, character) ||
    ifWeaponType(effect.enableIfWeaponType, character) ||
    ifTagged(effect.enableIfTagged, character);
};
