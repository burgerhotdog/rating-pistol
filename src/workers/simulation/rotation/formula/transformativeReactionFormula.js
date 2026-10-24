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

function transformativeBaseDamage(statMap, rxnKey, foamHealing) {
  if (rxnKey === 'oceanHuedClam') {
    return foamHealing * 0.9;
  }

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

export function transformativeReactionFormula(statMap, rxnKey, rxnElement, foamHealing) {
  return (
    transformativeBaseDamage(statMap, rxnKey, foamHealing) *
    getResMult(GI, rxnElement, statMap)
  );
}

export function transformativeReactionUsedAttrs(rxnKey, rxnElement) {
  if (rxnKey === 'oceanHuedClam') {
    return new Set([
      `physicalResReduction%`,
    ]);
  }

  return new Set([
    'elementalMastery',
    `${rxnKey}ReactionBonus%`,
    `${rxnKey}Flat`,
    `${rxnElement}ResReduction%`,
  ]);
}
