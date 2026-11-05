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
    getAttr(`${rxnGroup}BaseDmg%`, statMap) +
    getAttr(`${rxnKey}BaseDmg%`, statMap);

  const rxnBonusMult = 1 +
    getExclusiveEmBonus(emValue) +
    getAttr(`${rxnGroup}ReactionBonus%`, statMap) +
    getAttr(`${rxnKey}ReactionBonus%`, statMap);

  return (
    rxnMultiplier * LEVEL_MULTIPLIER *
    rxnBaseDmgBonusMult *
    rxnBonusMult +
    getAttr(`${rxnGroup}Flat`, statMap) +
    getAttr(`${rxnKey}Flat`, statMap)
  );
}

export function elevationReactionFormula(statMap, rxnKey, rxnMultiplier, rxnElement) {
  return (
    elevationBaseDamage(statMap, rxnKey, rxnMultiplier) *
    getCritMult(statMap) *
    getResMult(GI, rxnElement, statMap) *
    (1 + getAttr(`${rxnKey}ExtraStrikeChance%`, statMap))
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
    `${rxnKey}Flat`,
    `${rxnGroup}Flat`,
    'critRate%',
    'critDmg%',
    'resReduction%',
    `${rxnElement}ResReduction%`,
    'elementalResReduction%',
    'resIgnore%',
    `${rxnElement}ResIgnore%`,
    'elementalResIgnore%',
    `${rxnKey}ExtraStrikeChance%`,
  ]);
}
