import { CHARACTERS, WEAPONS } from '@/data';

export function getDefaultCharacterRank(gameId, characterId) {
  const { quality } = CHARACTERS[gameId][characterId];
  return quality === 5 ? 0 : 6;
}

export function getDefaultWeaponRank(gameId, weaponId) {
  const { quality } = WEAPONS[gameId][weaponId];
  return quality === 5 ? 1 : 5;
}
