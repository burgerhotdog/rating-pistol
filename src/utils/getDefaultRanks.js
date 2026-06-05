import { CHARACTER, WEAPON } from '@/data';

export function getDefaultCharacterRank(gameId, characterId) {
  const { quality } = CHARACTER[gameId][characterId];
  return quality === 5 ? 0 : 6;
}

export function getDefaultWeaponRank(gameId, weaponId) {
  const { quality } = WEAPON[gameId][weaponId];
  return quality === 5 ? 1 : 5;
}
