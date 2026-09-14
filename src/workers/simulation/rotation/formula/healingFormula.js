import { getAttr } from '@/utils';
import { computeBase } from './computeBase';

export function runHealingFormula(action, statMap) {
  const { healing, times = 1 } = action;
  const { compressed } = healing;

  let healingValue = computeBase('healing', compressed, statMap);

  healingValue *= 1 + getAttr('healingBonus%', statMap);
  healingValue *= 1 + getAttr('healingReceived%', statMap);

  return healingValue * times;
}
