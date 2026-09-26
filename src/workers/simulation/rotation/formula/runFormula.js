import { runDamageFormula } from './damageFormula';
import { runTuneFormula } from './tuneFormula';
import { runHealingFormula } from './healingFormula';
import { runShieldFormula } from './shieldFormula';
import { runStellarFormula } from './stellarFormula';

export function runFormula(gameId, part, action, statMap, stellarMultiplier) {
  switch (part) {
    case 'damage':
      if (action.damage.type === 'stellarConduct' || action.damage.type === 'stellarSwirl') {
        return runStellarFormula(action, statMap, stellarMultiplier);
      }

      if (action.damage.attr === 'tuneAmp') {
        const { element, compressed } = action.damage;
        const { tuneAmp } = compressed.mvs;

        return runTuneFormula(statMap, tuneAmp, element);
      }

      return runDamageFormula(gameId, action, statMap);

    case 'healing':
      return runHealingFormula(action, statMap);

    case 'shield':
      return runShieldFormula(action, statMap);
  }
};
