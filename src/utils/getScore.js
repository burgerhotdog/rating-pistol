import { AVATAR_DATA, WEAPON_DATA, STAT_DATA } from '@data';

const getScore = (gameId, avatarId, weaponId, statList) => {
  const avatarBaseStats = AVATAR_DATA[gameId][avatarId].baseStats;
  const weaponBaseStats = WEAPON_DATA[gameId][weaponId].baseStats;
  const baseStats = {
    _HP: avatarBaseStats._HP + (weaponBaseStats._HP ?? 0),
    _ATK: avatarBaseStats._ATK + (weaponBaseStats._ATK ?? 0),
    _DEF: avatarBaseStats._DEF + (weaponBaseStats._DEF ?? 0),
  };

  const { weights } = AVATAR_DATA[gameId][avatarId];
  if (!weights) return null;

  return statList.reduce((acc, { stat, value }) => {
    if (!stat || !value) return acc;

    const percentStat = stat[0] === '_' ? stat.slice(1) : stat;
    const weight = weights[percentStat];
    if (!weight) return acc;

    const percentValue = stat[0] === '_'
      ? (value / baseStats[stat]) * 100
      : value;

    const rolls = (percentValue / STAT_DATA[gameId][percentStat].subValue) * 100;
    return acc + rolls * weight;
  }, 0);
}

export default getScore;
