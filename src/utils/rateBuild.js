import { AVATAR_DATA, WEAPON_DATA, INFO_DATA, STAT_DATA } from '@data';
import { generateDataset, calculateBench } from '@utils';

const calculateRolls = (gameId, fullWeights, statList) => {
  return statList.reduce((acc, { stat, value }) => {
    const weight = fullWeights[stat];
    if (!stat || !value || !weight) return acc;
    const { subValue } = STAT_DATA[gameId][stat];
    return acc + value / subValue * weight;
  }, 0);
};

const calculateMax = (gameId, fullWeights, mainstat) => {
  let substats = [];

  // add best substats
  const orderedStatPool = Object.entries(fullWeights)
    .filter(([stat]) => gameId === 'ww' || stat !== mainstat)
    .sort((a, b) => b[1] - a[1])
    .map(([stat]) => stat);

  for (let i = 0; i < INFO_DATA[gameId].NUM_SUBSTATS; i++) {
    const stat = orderedStatPool[i];
    if (!stat) break; // stop if run out of weighted stats
    substats.push({ stat, rolls: 1 });
  }

  // add additional rolls into best substat
  if (gameId !== 'ww' && substats.length) substats[0].rolls += 5;

  return substats.reduce((acc, { stat, rolls }) => {
    return acc + rolls * fullWeights[stat];
  }, 0);
};

export default (gameId, avatarId, weaponId, equipList) => {
  if (!weaponId) return undefined;
  if (equipList.some(({ stat }) => !stat)) return undefined;
  if (!AVATAR_DATA[gameId][avatarId].weights) return null;

  // combine avatar and weapon base stat values
  const avatarBaseStats = AVATAR_DATA[gameId][avatarId].baseStats;
  const weaponBaseStats = WEAPON_DATA[gameId][weaponId].baseStats;
  const baseStats = {
    _HP: avatarBaseStats._HP + (weaponBaseStats._HP ?? 0),
    _ATK: avatarBaseStats._ATK + (weaponBaseStats._ATK ?? 0),
    _DEF: avatarBaseStats._DEF + (weaponBaseStats._DEF ?? 0),
  };

  // calculate flat stat weights
  const fullWeights = { ...AVATAR_DATA[gameId][avatarId].weights };
  for (const [baseStat, baseValue] of Object.entries(baseStats)) {
    const pWeight = fullWeights[baseStat.slice(1)];
    if (!pWeight) continue;
    const fSubValue = STAT_DATA[gameId][baseStat].subValue;
    const pSubValue = STAT_DATA[gameId][baseStat.slice(1)].subValue
    const flatRatio = fSubValue / baseValue * 100 / pSubValue;
    fullWeights[baseStat] = flatRatio * pWeight;
  }

  // per equip calculations
  const equipRatings = equipList.map(({ stat, statList }) => {
    const rolls = calculateRolls(gameId, fullWeights, statList);
    const max = calculateMax(gameId, fullWeights, stat);
    const dataset = generateDataset(gameId, fullWeights, stat);
    return { rolls, max, dataset };
  });

  // combined calculations
  const rolls = equipRatings.reduce((acc, { rolls }) => acc + rolls, 0);
  const mainstats = equipList.map(({ stat }) => stat);
  const bench = calculateBench(gameId, fullWeights, mainstats);
  return { rolls, bench, equips: equipRatings };
};
