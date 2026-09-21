import { lerp } from '../math';

export function resolveRankedValue(range, rank) {
  const [r1, r5] = range;
  return lerp(r1, r5, (rank - 1) / 4);
}
