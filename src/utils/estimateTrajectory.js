import { lerp } from './math';

export function estimateDay(inputDps, dpsCeiling, dpsProgression, fit) {
  if (inputDps >= dpsCeiling) {
    return Infinity;
  }

  if (inputDps > dpsProgression.at(-1).mean) {
    return (fit.A / (dpsCeiling - inputDps)) ** (1 / fit.q);
  }

  const datapoint = dpsProgression.find(({ mean }) => mean === inputDps);

  if (datapoint) {
    return datapoint.day;
  }

  const hiIndex = dpsProgression.findIndex(({ mean }) => mean > inputDps);
  const hi = dpsProgression[hiIndex];
  const lo = dpsProgression[hiIndex - 1];

  const t = (inputDps - lo.mean) / (hi.mean - lo.mean);
  return lerp(lo.day, hi.day, t);
}

export function estimateDps(inputDay, dpsCeiling, dpsProgression, fit) {
  if (inputDay > dpsProgression.at(-1).day) {
    return dpsCeiling - fit.A * inputDay ** -fit.q;
  }

  const datapoint = dpsProgression.find(({ day }) => day === inputDay);

  if (datapoint) {
    return datapoint.mean;
  }

  const hiIndex = dpsProgression.findIndex(({ day }) => day > inputDay);
  const hi = dpsProgression[hiIndex];
  const lo = dpsProgression[hiIndex - 1];

  const t = (inputDay - lo.day) / (hi.day - lo.day);
  return lerp(lo.mean, hi.mean, t);
}
