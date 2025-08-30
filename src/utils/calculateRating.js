import { AVATAR_DATA } from '@data';
import { calculateRolls, generateDataset, calculateMax, calculateBench, getBaseStats } from '@utils';

const calculateMean = (data) => {
  return data.reduce((acc, curr) => acc + curr, 0) / data.length;
};

const calculatePercentile = (point, data) => {
  const countBelow = data.filter(curr => curr < point).length;
  return (countBelow / data.length) * 100;
};

export default (gameId, avatarId, weaponId, equipList) => {
  // ensure character has weights
  if (!AVATAR_DATA[gameId][avatarId].weights) return null;

  // ensure build is complete
  if (!weaponId) return undefined;
  if (equipList.some(({ stat }) => !stat)) return undefined;

  // prepare base stats for future calculations
  const baseStats = getBaseStats(gameId, avatarId, weaponId);

  // calculate rolls and generate dataset for each equip
  const equipRatings = equipList.map(({ stat, statList }) => {
    // generate dataset of roll counts
    const dataset = generateDataset(gameId, avatarId, baseStats, stat);

    // calculate realistic benchmark and maximum possible rolls
    const rollsBench = calculateBench(gameId, avatarId, baseStats, stat);
    const rollsMax = calculateMax(gameId, avatarId, baseStats, stat);

    const rolls = calculateRolls(gameId, avatarId, baseStats, statList);
    const percentile = calculatePercentile(rolls, dataset);
    return { rolls, percentile, rollsBench, rollsMax, dataset };
  });

  const rolls = equipRatings.reduce((sum, { rolls }) => sum + rolls, 0);
  const rollsBench = equipRatings.reduce((sum, { rollsBench }) => sum + rollsBench, 0);
  return { rolls, rollsBench, equips: equipRatings };
};
