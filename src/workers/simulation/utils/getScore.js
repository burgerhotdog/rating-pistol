export const getScore = (totals, penalty, ...args) => {
  const nonDamageMult = args.includes('damageOnly') ? 0 : 1;

  const baseScore = totals.damage + nonDamageMult * (totals.healing + totals.shield);
  return baseScore * penalty;
};
