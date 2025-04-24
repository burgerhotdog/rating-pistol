import { getScore, simEquipScores, simAvatarScores } from "@utils";

const calcPercentile = (score, simScores) => {
  const countBelow = simScores.filter(simScore => simScore < score).length;
  return (countBelow / simScores.length) * 100;
};

const getRating = (gameId, avatarId, equipList) => {
  const equipRatings = equipList.map(({ stat, statList }) => {
    const score = getScore(gameId, avatarId, statList);
    const simScores = simEquipScores(gameId, avatarId, stat);
    if (!simScores) return null;

    const percentile = calcPercentile(score, simScores);
    return { percentile, score, simScores };
  });
  if (equipRatings.some(rating => !rating)) return null;

  const score = equipRatings.reduce((acc, { score }) => acc + score, 0);
  const [simScores, investmentLevels] = simAvatarScores(gameId, equipRatings, equipList.map(({ stat }) => stat));
  const percentile = calcPercentile(score, simScores);
  
  return {
    avatar: { percentile, score, simScores, investmentLevels },
    equips: equipRatings,
  };
};

export default getRating;
