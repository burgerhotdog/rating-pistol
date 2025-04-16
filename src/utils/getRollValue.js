import { STATS } from "@data";

const getRollValue = (gameId, statList, weights) => {
  const rollValue = statList.reduce((acc, { stat, value }) => {
    if (!stat || !value) return acc;

    const weight = weights[stat];
    if (!weight) return acc;

    const rolls = value / STATS[gameId][stat].subValue;
    return acc + rolls * weight * 100;
  }, 0);
  const multiplier = gameId === "ww" ? 2 : 1;
  return Math.round(rollValue * multiplier);
};

export default getRollValue;
