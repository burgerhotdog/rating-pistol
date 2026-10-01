import { runDamageFormula } from './damageFormula';
import { runTuneFormula } from './tuneFormula';
import { runHealingFormula } from './healingFormula';
import { runShieldFormula } from './shieldFormula';
import { runStellarFormula } from './stellarFormula';
import { runNegativeStatusFormula } from './negativeStatusFormula';

export function runFormula(gameId, part, action, statMap, stellarMultiplier) {
  if (part === 'healing') {
    return runHealingFormula(action, statMap);
  }

  if (part === 'shield') {
    return runShieldFormula(action, statMap);
  }

  const damageType = action.damage.type;

  if (damageType === 'stellarConduct' || damageType === 'stellarSwirl') {
    return runStellarFormula(action, statMap, stellarMultiplier);
  }

  if (action.damage.attr === 'statusAmp') {
    return runNegativeStatusFormula(action, statMap);
  }

  if (action.damage.attr === 'tuneAmp') {
    const { element, compressed } = action.damage;
    const { tuneAmp } = compressed.mvs;

    return runTuneFormula(statMap, tuneAmp, element);
  }

  return runDamageFormula(gameId, action, statMap);
};
