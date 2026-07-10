import { getAttr } from '@/utils';

export const getCritMult = (statMap) => {
  const rawCritRate = getAttr('critRate%', statMap);
  const critRate = Math.max(Math.min(rawCritRate, 1), 0);
  const critDamage = getAttr('critDmg%', statMap);

  return critRate * (1 + critDamage) + (1 - critRate);
};
