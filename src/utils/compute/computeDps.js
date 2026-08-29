import { getTotals } from '../getTotals';

export function computeDps(snapshots, rotationTime, penalty = 1) {
  const totalDamage = getTotals(snapshots).damage;
  const timeInSeconds = rotationTime / 1000;
  return totalDamage / timeInSeconds * penalty;
}
