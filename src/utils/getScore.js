import { AVATAR_DATA, STAT_DATA } from "@data";

const getScore = (gameId, avatarId, statList) => {
  const { weights } = AVATAR_DATA[gameId][avatarId];
  const score = statList.reduce((acc, { stat, value }) => {
    if (!stat || !value) return acc;

    const weight = weights[stat];
    if (!weight) return acc;

    const rolls = value / STAT_DATA[gameId][stat].subValue;
    return acc + rolls * weight;
  }, 0);
  const multiplier = gameId === "ww" ? 2 : 1;
  return (score * multiplier);
};

export default getScore;
