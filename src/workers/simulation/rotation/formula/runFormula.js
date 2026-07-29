import { getAttr } from '@/utils';
import { computeBase } from './computeBase';
import { getCritMult } from './crit';
import { getDmgBonusMult } from './dmgBonus';
import { getDmgAmpMult } from './dmgAmp';
import { getDefMult } from './enemyDef';
import { getResMult } from './enemyRes';
import { runTuneFormula } from '../special/tune';

function runDamageFormula(gameId, action, statMap) {
  if (action.damage.attr === 'tuneAmp') {
    const tuneAmp = action.damage.compressed.mvs.tuneAmp;
    const element = action.damage.element;
    return runTuneFormula(gameId, statMap, tuneAmp, element);
  }

  const { damage, times = 1 } = action;
  const { type, extraType, element, compressed } = damage;
  const bonusTypes = [
    element,
    type,
    ...(extraType ? [extraType] : []),
  ];

  const baseValue = computeBase('damage', compressed, statMap);

  const critMult = getCritMult(statMap);
  const dmgBonusMult = getDmgBonusMult(statMap, bonusTypes);
  const dmgAmpMult = getDmgAmpMult(statMap, bonusTypes);

  const resMult = getResMult(gameId, element, statMap);
  const defMult = getDefMult(gameId, statMap);

  const vulnMult = 1 + getAttr('vuln%', statMap);

  return baseValue *
    critMult * dmgBonusMult * dmgAmpMult *
    resMult * defMult *
    vulnMult *
    times;
}

function runHealingFormula(action, statMap) {
  const { healing, times = 1 } = action;
  const { compressed } = healing;
  const baseValue = computeBase('healing', compressed, statMap);
  const healingBonus = 1 + getAttr('healingBonus%', statMap);
  const healingReceived = 1 + getAttr('healingReceived%', statMap);

  return baseValue *
    healingBonus * healingReceived *
    times;
}

function runShieldFormula(action, statMap) {
  const { shield, times = 1 } = action;
  const { compressed } = shield;
  const baseValue = computeBase('shield', compressed, statMap);
  const shieldBonus = 1 + getAttr('shieldBonus%', statMap);

  return baseValue *
    shieldBonus *
    times;
}

export function runFormula(gameId, part, action, statMap) {
  switch (part) {
    case 'damage':
      return runDamageFormula(gameId, action, statMap);
    case 'healing':
      return runHealingFormula(action, statMap);
    case 'shield':
      return runShieldFormula(action, statMap);
  }
};
