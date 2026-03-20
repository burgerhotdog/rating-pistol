import { CHARACTER_LOOKUP, WEAPON_LOOKUP, GENERAL_LOOKUP, GENERAL_LOOKUP } from '@/lookups';
import { generateDataset, calculateBench } from '@/utils';

const calculateRolls = (gameId, fullWeights, subStatList) => {
  return subStatList.reduce((acc, { subStatId, value }) => {
    const weight = fullWeights[subStatId];
    if (!subStatId || !value || !weight) return acc;
    const { subValue } = GENERAL_LOOKUP[gameId].STATS[subStatId];
    return acc + value / subValue * weight;
  }, 0);
};

const calculateMax = (gameId, fullWeights, mainstat) => {
  let substats = [];

  // add best substats
  const orderedStatPool = Object.entries(fullWeights)
    .filter(([statId]) => gameId === 'wuthering-waves' || statId !== mainstat)
    .sort((a, b) => b[1] - a[1])
    .map(([statId]) => statId);

  for (let i = 0; i < GENERAL_LOOKUP[gameId].NUM_SUBSTATS; i++) {
    const statId = orderedStatPool[i];
    if (!statId) break; // stop if run out of weighted stats
    substats.push({ statId, rolls: 1 });
  }

  // add additional rolls into best substat
  if (gameId !== 'wuthering-waves' && substats.length) substats[0].rolls += 5;

  return substats.reduce((acc, { statId, rolls }) => {
    return acc + rolls * fullWeights[statId];
  }, 0);
};

export default (gameId, avatarId, weaponId, equipList) => {
  if (!weaponId) return undefined;
  if (equipList.some(({ mainStatId }) => !mainStatId)) return undefined;
  if (!CHARACTER_LOOKUP[gameId][avatarId].weights) return null;

  // combine avatar and weapon base stat values
  const avatarBaseStats = CHARACTER_LOOKUP[gameId][avatarId].baseStats;
  const weaponBaseStats = WEAPON_LOOKUP[gameId][weaponId].baseStats;
  const baseStats = {
    _HP: avatarBaseStats._HP + (weaponBaseStats._HP ?? 0),
    _ATK: avatarBaseStats._ATK + (weaponBaseStats._ATK ?? 0),
    _DEF: avatarBaseStats._DEF + (weaponBaseStats._DEF ?? 0),
  };

  // calculate flat stat weights
  const fullWeights = { ...CHARACTER_LOOKUP[gameId][avatarId].weights };
  for (const [baseStat, baseValue] of Object.entries(baseStats)) {
    const pWeight = fullWeights[baseStat.slice(1)];
    if (!pWeight) continue;
    const fSubValue = GENERAL_LOOKUP[gameId].STATS[baseStat].subValue;
    const pSubValue = GENERAL_LOOKUP[gameId].STATS[baseStat.slice(1)].subValue;
    const flatRatio = fSubValue / baseValue * 100 / pSubValue;
    fullWeights[baseStat] = flatRatio * pWeight;
  }

  // per equip calculations
  const equipRatings = equipList.map(({ mainStatId, subStatList }) => {
    const rolls = calculateRolls(gameId, fullWeights, subStatList);
    const max = calculateMax(gameId, fullWeights, mainStatId);
    const dataset = generateDataset(gameId, fullWeights, mainStatId);
    return { rolls, max, dataset };
  });

  // combined calculations
  const rolls = equipRatings.reduce((acc, { rolls }) => acc + rolls, 0);
  const mainstats = equipList.map(({ mainStatId }) => mainStatId);
  const bench = calculateBench(gameId, fullWeights, mainstats);
  return { rolls, bench, equips: equipRatings };
};
