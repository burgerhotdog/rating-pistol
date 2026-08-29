import { linearRegression } from 'simple-statistics';

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

export const diff = (a, b) => a / b - 1;

export const lerp = (a, b, t) => a + (b - a) * t;

export const inRange = (value, min, max) => value >= min && value <= max;

export function fitDecay(points) {
  if (points.length < 2) {
    throw new Error('fitDecay requires at least 2 points');
  }

  const logPoints = points.map(([x, y]) => {
    if (x <= 0 || y <= 0) {
      throw new Error(`fitDecay requires positive x and y, got (${x}, ${y})`);
    }
    return [Math.log(x), Math.log(y)];
  });

  const { m, b } = linearRegression(logPoints);

  return { k: -m, A: Math.exp(b) };
}
