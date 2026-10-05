export const getEmBonus = (emValue) =>
  (2.78 * emValue) / (1400 + emValue);

export const getExclusiveEmBonus = (emValue) =>
  (6 * emValue) / (2000 + emValue);
