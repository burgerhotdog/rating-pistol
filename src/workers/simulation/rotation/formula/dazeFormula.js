import { getAttr } from '@/utils';
import { computeBase } from './computeBase';

export function runDazeFormula(action, statMap) {
  const { daze, times = 1 } = action;
  const { compressed } = daze;

  return (
    computeBase('daze', compressed, statMap) *
    (1 + getAttr('daze%', statMap)) *
    times
  );
}
