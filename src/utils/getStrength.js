const getStrength = (score, mean, power = 1) => {
  return Math.pow(score / mean, power);
};

export default getStrength;
