import { runDamageFormula } from './runDamageFormula';
import { runTuneFormula } from './runTuneFormula';

export function runFormula(helpers, action, enemyMap, statMap) {
  if (action.attr === 'tuneAmp') {
    return runTuneFormula(helpers, action, enemyMap, statMap);
  }

  return runDamageFormula(helpers, action, enemyMap, statMap);
};
