const getRollValue = (gameId, substats, STAT_INDEX, weights) => {
  const rollValue = substats.reduce((acc, { key, value }) => {
    if (!key || !value) return acc;

    const weight = weights[key];
    if (!weight) return acc;

    const rolls = Number(value) / STAT_INDEX[key].valueSub;
    return acc + rolls * weight * 100;
  }, 0);
  const multiplier = gameId === "ww" ? 2 : 1; 
  return Math.round(rollValue * multiplier);
};

export default getRollValue;
