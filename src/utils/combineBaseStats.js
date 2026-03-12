import { ALL_CHARACTER_LOOKUP, ALL_WEAPON_LOOKUP } from '@/lookups';

export function combineBaseStats(gameId, avatarId, weaponId) {
  const characterStats = ALL_CHARACTER_LOOKUP[gameId][avatarId].baseStats;
  const weaponStats = ALL_WEAPON_LOOKUP[gameId][weaponId].baseStats;
  const result = {};

  for (const statId in characterStats) {
    result[statId] = characterStats[statId] + (weaponStats[statId] || 0);
  }

  return result;
};
