import { GI } from '@/data';
import { getAttr } from '@/utils';
import { getTransformativeEmBonus } from './getEmBonus';
import { getResMult } from './enemyRes';

const LEVEL_MULTIPLIER = 1446.85;

const RXN_MULTIPLIERS = {
  hyperbloom: 3,
  burgeon: 3,
  shattered: 3,
  overloaded: 2.75,
  electroCharged: 2,
  bloom: 2,
  superconduct: 1.5,
  swirl: 0.6,
  burning: 0.25,
};

function transformativeBaseDamage(statMap, rxnKey) {
  const emValue = getAttr('elementalMastery', statMap);

  const rxnBonusMult = 1 +
    getTransformativeEmBonus(emValue) +
    getAttr(`${rxnKey}ReactionBonus%`, statMap);

  return (
    RXN_MULTIPLIERS[rxnKey] * LEVEL_MULTIPLIER *
    rxnBonusMult +
    getAttr(`${rxnKey}Flat`, statMap)
  );
}

export function transformativeReactionFormula(statMap, rxnKey, rxnElement) {
  return (
    transformativeBaseDamage(statMap, rxnKey) *
    getResMult(GI, rxnElement, statMap)
  );
}

export function transformativeReactionUsedAttrs(rxnKey, rxnElement) {
  return new Set([
    'elementalMastery',
    `${rxnKey}ReactionBonus%`,
    `${rxnKey}Flat`,
    `${rxnElement}ResReduction%`,
  ]);
}
