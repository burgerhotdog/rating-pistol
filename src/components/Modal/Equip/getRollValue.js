const getRollValue = (substats, STAT_INDEX, weights) => {
  const rollValue = substats.reduce((acc, { key, value }) => {
    if (!key || !value) return acc;

    const weight = weights[key];
    if (!weight) return acc;

    const rolls = Number(value) / STAT_INDEX[key].valueSub;
    return acc + rolls * weight * 100;
  }, 0);
  
  return Math.round(rollValue);
};

export default getRollValue;
