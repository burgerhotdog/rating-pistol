const acceptDecimals = (fn) => (value, decimals = 0) => {
  const factor = 10 ** decimals;
  return fn(value * factor) / factor;
};

export const round = acceptDecimals(Math.round);
export const floor = acceptDecimals(Math.floor);
export const ceil = acceptDecimals(Math.ceil);

export const random = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min, max) => {
  return Math.floor(random(min, max + 1));
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

