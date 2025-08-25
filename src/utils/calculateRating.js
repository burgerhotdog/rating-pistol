import { AVATAR_DATA } from '@data';
import { calculateScore, simulateScores, simulateMax } from '@utils';

const calculateMean = (data) => {
  return data.reduce((acc, curr) => acc + curr, 0) / data.length;
};

const calculatePercentile = (point, data) => {
  const countBelow = data.filter(curr => curr < point).length;
  return (countBelow / data.length) * 100;
};

export default (gameId, avatarId, weaponId, equipList) => {
  // character has no weights
  if (!AVATAR_DATA[gameId][avatarId].weights) return null;

  // build is incomplete
  if (!weaponId) return undefined;
  if (equipList.some(({ stat }) => !stat)) return undefined;

  // calculate scores and simulation data for equips
  const equipRatings = equipList.map(({ stat, statList }) => {
    // generate simulated scores
    const scoreData = simulateScores(gameId, avatarId, weaponId, stat);
    const mean = calculateMean(scoreData);

    // generate maximum possible score
    const scoreMax = simulateMax(gameId, avatarId, weaponId, stat);

    const score = calculateScore(gameId, avatarId, weaponId, statList);
    const percentile = calculatePercentile(score, scoreData);
    return { score, percentile, scoreMax, scoreData, mean };
  });

  const score = equipRatings.reduce((acc, { score }) => acc + score, 0);
  const scoreMax = equipRatings.reduce((acc, { scoreMax }) => acc + scoreMax, 0);
  return { score, scoreMax, equips: equipRatings };
};
