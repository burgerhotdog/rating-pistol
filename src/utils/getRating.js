import { AVATAR_DATA } from '@data';
import { getScore, simEquipScores } from '@utils';

const calcMean = (data) => {
  return data.reduce((acc, curr) => acc + curr, 0) / data.length;
};

const calcStandardDeviation = (mean, data) => {
  return Math.sqrt(data.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) / data.length);
};

const calcPercentile = (point, data) => {
  const countBelow = data.filter(curr => curr < point).length;
  return (countBelow / data.length) * 100;
};

const getRating = (gameId, avatarId, weaponId, equipList) => {
  if (!AVATAR_DATA[gameId][avatarId].weights) return null;
  if (!weaponId) return undefined;
  if (equipList.some(({ stat }) => !stat)) return undefined;

  const equipRatings = equipList.map(({ stat, statList }) => {
    const scoreData = simEquipScores(gameId, avatarId, weaponId, stat);
    const sortedData = [...scoreData].sort((a, b) => a - b);
    const q3Index = Math.floor(sortedData.length * 0.75);
    const q3 = sortedData[q3Index];
    const score = getScore(gameId, avatarId, weaponId, statList);
    const percentile = calcPercentile(score, scoreData);
    return { percentile, score, scoreData, q3 };
  });

  const score = equipRatings.reduce((acc, { score }) => acc + score, 0);
  return {
    avatar: { score },
    equips: equipRatings,
  };
};

export default getRating;
