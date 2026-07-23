import { getAttr } from '@/utils';
import { computeBase } from './computeBase';
import { getCritMult } from './crit';
import { getDmgBonusMult } from './dmgBonus';
import { getDmgAmpMult } from './dmgAmp';
import { runTuneFormula } from '../special/tune';

function runDamageFormula(helpers, action, statMap) {
  const { getResMult, getDefMult } = helpers;
  const { dmgType, extraDmgType, element, compressed, times = 1 } = action;
  const baseValue = computeBase(compressed, statMap);

  const critMult = getCritMult(statMap);

  const bonusTypes = [element, dmgType, ...(extraDmgType ? [extraDmgType] : [])];
  const dmgBonusMult = getDmgBonusMult(statMap, bonusTypes);
  const dmgAmpMult = getDmgAmpMult(statMap, bonusTypes);

  const resMult = getResMult(element, statMap);
  const defMult = getDefMult(statMap);

  const vulnMult = 1 + getAttr('vuln%', statMap);

  return baseValue *
    critMult * dmgBonusMult * dmgAmpMult *
    resMult * defMult *
    vulnMult *
    times;
}

function runHealingFormula(action, statMap) {
  const { compressed, times = 1 } = action;
  const baseValue = computeBase(compressed, statMap);
  const healingBonus = 1 + getAttr('healingBonus%', statMap);
  const healingReceived = 1 + getAttr('healingReceived%', statMap);

  return baseValue *
    healingBonus * healingReceived *
    times;
}

function runShieldFormula(action, statMap) {
  const { compressed, times = 1 } = action;
  const baseValue = computeBase(compressed, statMap);
  const shieldBonus = 1 + getAttr('shieldBonus%', statMap);

  return baseValue *
    shieldBonus *
    times;
}

export function runFormula(helpers, action, statMap) {
  if (action.attr === 'tuneAmp') {
    const tuneAmp = action.compressed.mvs.tuneAmp;
    const element = action.element;
    return runTuneFormula(helpers, statMap, tuneAmp, element);
  }

  switch (action.type) {
    case 'damage':
      return runDamageFormula(helpers, action, statMap);
    case 'healing':
      return runHealingFormula(action, statMap);
    case 'shield':
      return runShieldFormula(action, statMap);
  }
};
