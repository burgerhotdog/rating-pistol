import STATS from "@data/static/stats";

const getRollValue = (gameId, substats, weights) => {
  const rollValue = substats.reduce((acc, { stat, value }) => {
    if (!stat || !value) return acc;

    const weight = weights[stat];
    if (!weight) return acc;

    const rolls = Number(value) / STATS[gameId][stat].value;
    return acc + rolls * weight * 100;
  }, 0);
  const multiplier = gameId === "ww" ? 2 : 1;
  return Math.round(rollValue * multiplier);
};

export default getRollValue;
