import { clamp, getAttr } from '@/utils';

export function getCritMult(statMap) {
  const rawCritRate = getAttr('critRate%', statMap);
  const critRate = clamp(rawCritRate, 0, 1);
  const critDamage = getAttr('critDmg%', statMap);

  return critRate * (1 + critDamage) + (1 - critRate);
}
