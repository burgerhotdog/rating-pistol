import { AVATAR_DATA, WEAPON_DATA, STAT_DATA } from '@data';

export default (gameId, avatarId, weaponId, statList) => {
  // prepare base stats
  const avatarBaseStats = AVATAR_DATA[gameId][avatarId].baseStats;
  const weaponBaseStats = WEAPON_DATA[gameId][weaponId].baseStats;
  const baseStats = {
    _HP: avatarBaseStats._HP + (weaponBaseStats._HP ?? 0),
    _ATK: avatarBaseStats._ATK + (weaponBaseStats._ATK ?? 0),
    _DEF: avatarBaseStats._DEF + (weaponBaseStats._DEF ?? 0),
  };

  // prepare weights
  const { weights } = AVATAR_DATA[gameId][avatarId];
  if (!weights) return null;

  // calculate
  return statList.reduce((acc, { stat, value }) => {
    // check if empty substat
    if (!stat || !value) return acc;

    // convert flat stat to percent stat
    const pStat = stat[0] === '_' ? stat.slice(1) : stat;

    // check if stat has weight
    const weight = weights[pStat];
    if (!weight) return acc;

    // convert flat value to percent value
    const pValue = stat[0] === '_' ? (value / baseStats[stat]) * 100 : value;

    // calculate stat score
    const { subValue } = STAT_DATA[gameId][pStat];
    const statScore = (pValue / subValue) * 100;

    // wuwa scores have 2x multiplier
    const wuwaMult = gameId === 'ww' ? 2 : 1;
    return acc + statScore * weight * wuwaMult;
  }, 0);
};
