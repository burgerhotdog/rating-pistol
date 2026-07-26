import { CHARACTER, WEAPON } from '@/data';

export function getDefaultCharacterRank(gameId, charId) {
  const { quality } = CHARACTER[gameId][charId];
  return quality === 5 ? 0 : 6;
}

export function getDefaultWeaponRank(gameId, weaponId) {
  const { quality } = WEAPON[gameId][weaponId];
  return quality === 5 ? 1 : 5;
}
