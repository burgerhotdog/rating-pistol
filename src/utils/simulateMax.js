import { AVATAR_DATA, WEAPON_DATA, INFO_DATA, STAT_DATA } from '@data';
import { calculateScore } from '@utils';

export default (gameId, avatarId, weaponId, mainstat) => {
  // prepare base stats
  const avatarBaseStats = AVATAR_DATA[gameId][avatarId].baseStats;
  const weaponBaseStats = WEAPON_DATA[gameId][weaponId].baseStats;
  const baseStats = {
    _HP: avatarBaseStats._HP + (weaponBaseStats._HP ?? 0),
    _ATK: avatarBaseStats._ATK + (weaponBaseStats._ATK ?? 0),
    _DEF: avatarBaseStats._DEF + (weaponBaseStats._DEF ?? 0),
  };

  // prepare substat pool
  const { weights } = AVATAR_DATA[gameId][avatarId];
  const weightsWithFlats = { ...weights };
  for (const [baseStat, baseValue] of Object.entries(baseStats)) {
    if (baseStat.slice(1) in weightsWithFlats) {
      const { subValue } = STAT_DATA[gameId][baseStat];
      const pValue = (subValue / baseValue) * 100;
      const valueRatio = (pValue / STAT_DATA[gameId][baseStat.slice(1)]) * 100;
      weightsWithFlats[baseStat] = valueRatio * weights[baseStat.slice(1)];
    }
  }

  const statPool = Object.entries(weightsWithFlats)
    .filter(([stat]) => {
      if (gameId === 'ww') return true; // wuwa subs can match mainstat
      return stat !== mainstat;
    })
    .sort((a, b) => b[1] - a[1]) // order by weight
    .map(([stat]) => stat);
  
  // adding the substat lines (based on avatar weights)
  const { NUM_SUBSTATS } = INFO_DATA[gameId];
  let substats = [];
  for (let i = 0; i < NUM_SUBSTATS; i++) {
    const stat = statPool[i];
    if (!stat) break;
    const { subValue } = STAT_DATA[gameId][stat]
    substats.push({ stat, value: subValue });
  }

  // adding the rest of the rolls
  if (gameId !== 'ww') {
    const { stat } = substats[0];
    substats[0].value += STAT_DATA[gameId][stat].subValue * 5;
  }

  return calculateScore(gameId, avatarId, weaponId, substats);
};
