import { AVATAR_DATA, WEAPON_DATA } from '@data';

export default (gameId, avatarId, weaponId) => {
  const avatarBaseStats = AVATAR_DATA[gameId][avatarId].baseStats;
  const weaponBaseStats = WEAPON_DATA[gameId][weaponId].baseStats;
  return {
    _HP: avatarBaseStats._HP + (weaponBaseStats._HP ?? 0),
    _ATK: avatarBaseStats._ATK + (weaponBaseStats._ATK ?? 0),
    _DEF: avatarBaseStats._DEF + (weaponBaseStats._DEF ?? 0),
  };
};
