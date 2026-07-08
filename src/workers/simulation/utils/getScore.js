import { getTotals } from '@/utils';

export const getScore = (totals, penalty, ...args) => {
  const nonDamageMult = args.includes('damageOnly') ? 0 : 1;

  const baseScore = totals.damage + nonDamageMult * (totals.healing + totals.shield);
  return baseScore * penalty;
};

export const getWeightedScore = (summary, currId, penalty) => {
  const allTotals = getTotals(summary);
  const idTotals = getTotals(summary, { ownerId: currId });

  const baseScore = Object.entries(allTotals).reduce((acc, [type, value]) => {
    if (!value) return acc;

    const current = idTotals[type] ?? 0;
    return acc + value;
  }, 0);

  return baseScore * penalty;
};
