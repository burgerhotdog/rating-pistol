import { getScore, simEquipScores, simAvatarScores } from "@utils";

const calcPercentile = (score, simScores) => {
  const countBelow = simScores.filter(simScore => simScore < score).length;
  return (countBelow / simScores.length) * 100;
};

const getRating = (gameId, avatarId, weaponId, equipList) => {
  if (!weaponId) return null;
  
  const equipRatings = equipList.map(({ stat, statList }) => {
    if (!stat) return null;
    const rawSimScores = simEquipScores(gameId, avatarId, weaponId, stat);
    const rawScore = getScore(gameId, avatarId, weaponId, statList);
    const average = rawSimScores.reduce((acc, score) => acc + score, 0) / rawSimScores.length;

    const simScores = rawSimScores.map(rawScore => rawScore / average);
    const score = rawScore / average;
    const percentile = calcPercentile(rawScore, rawSimScores);

    return { percentile, score, simScores, rawScore, rawSimScores };
  });
  if (equipRatings.some(rating => !rating)) return null;

  const rawSimScores = simAvatarScores(gameId, equipRatings, equipList.map(({ stat }) => stat));
  const rawScore = equipRatings.reduce((acc, { rawScore }) => acc + rawScore, 0);
  const average = rawSimScores.reduce((acc, score) => acc + score, 0) / rawSimScores.length;

  const simScores = rawSimScores.map(rawScore => rawScore / average);
  const score = rawScore / average;
  const percentile = calcPercentile(rawScore, rawSimScores);

  return {
    avatar: { percentile, score, simScores, rawScore, rawSimScores },
    equips: equipRatings,
  };
};

export default getRating;
