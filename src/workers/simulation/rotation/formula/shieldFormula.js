import { getAttr } from '@/utils';
import { computeBase } from './computeBase';

export function runShieldFormula(action, statMap) {
  const { shield, times = 1 } = action;
  const { compressed } = shield;

  let shieldValue = computeBase('shield', compressed, statMap);

  shieldValue *= 1 + getAttr('shieldBonus%', statMap);

  return shieldValue * times;
}
