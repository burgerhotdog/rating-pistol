import { AVATAR_DATA, STAT_DATA } from "@data";

const getScore = (gameId, avatarId, statList) =>
  statList.reduce((acc, { stat, value }) => {
    if (!stat || !value) return acc;

    const weight = AVATAR_DATA[gameId][avatarId].weights[stat];
    if (!weight) return acc;

    const rolls = value / STAT_DATA[gameId][stat].subValue;
    return acc + rolls * weight;
  }, 0);

export default getScore;
