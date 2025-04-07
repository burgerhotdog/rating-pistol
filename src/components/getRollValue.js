import { DATA } from "./importData";

const getRollValue = (gameId, substats, weights) => {
  const { STAT_INDEX } = DATA[gameId];
  const rollValue = substats.reduce((acc, { stat, value }) => {
    if (!stat || !value) return acc;

    const weight = weights[stat];
    if (!weight) return acc;

    const rolls = Number(value) / STAT_INDEX[stat].value;
    return acc + rolls * weight * 100;
  }, 0);
  const multiplier = gameId === "ww" ? 2 : 1; 
  return Math.round(rollValue * multiplier);
};

export default getRollValue;
