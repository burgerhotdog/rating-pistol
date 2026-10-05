import { GI } from '@/data';
import { getAttr } from '@/utils';
import { getExclusiveEmBonus } from './getEmBonus';
import { getCritMult } from './getCritMult';
import { getResMult } from './enemyRes';

const LEVEL_MULTIPLIER = 1446.85;

const getRxnGroup = (rxnKey) => rxnKey === 'stellarSwirl' ? 'stellarGlimmer' : 'lunar';

function elevationBaseDamage(statMap, rxnKey, rxnMultiplier) {
  const emValue = getAttr('elementalMastery', statMap);
  const rxnGroup = getRxnGroup(rxnKey);

  const rxnBaseDmgBonusMult = 1 +
    getAttr(`${rxnKey}BaseDmg%`, statMap) +
    getAttr(`${rxnGroup}BaseDmg%`, statMap);

  const rxnBonusMult = 1 +
    getExclusiveEmBonus(emValue) +
    getAttr(`${rxnKey}ReactionBonus%`, statMap) +
    getAttr(`${rxnGroup}ReactionBonus%`, statMap);

  return (
    rxnMultiplier * LEVEL_MULTIPLIER *
    rxnBaseDmgBonusMult *
    rxnBonusMult +
    getAttr(`${rxnGroup}Flat`, statMap)
  );
}

export function elevationReactionFormula(statMap, rxnKey, rxnMultiplier, rxnElement) {
  return (
    elevationBaseDamage(statMap, rxnKey, rxnMultiplier) *
    getCritMult(statMap) *
    getResMult(GI, rxnElement, statMap)
  );
}

export function elevationReactionUsedAttrs(rxnKey, rxnElement) {
  const rxnGroup = getRxnGroup(rxnKey);

  return new Set([
    `${rxnKey}BaseDmg%`,
    `${rxnGroup}BaseDmg%`,
    'elementalMastery',
    `${rxnKey}ReactionBonus%`,
    `${rxnGroup}ReactionBonus%`,
    `${rxnGroup}Flat`,
    'critRate%',
    'critDmg%',
    `${rxnElement}ResReduction%`,
  ]);
}
