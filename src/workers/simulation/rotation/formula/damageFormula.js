import { GI, WW } from '@/data';
import { getAttr } from '@/utils';
import { computeBase } from './computeBase';
import { getCritMult } from './getCritMult';
import { getDmgAmpMult } from './dmgAmp';
import { getDefMult } from './enemyDef';
import { getResMult } from './enemyRes';

export const getBonusTypes = (gameId, damage) => {
  const { element, type } = damage;

  const bonusTypes = [element, type];

  if (damage.extraType) {
    bonusTypes.push(damage.extraType);
  }

  if (gameId === GI && element !== 'physical') {
    bonusTypes.push('elemental');
  }

  return bonusTypes;
}

const dmgBonusMultiplier = (statMap, dmgTypes) => {
  let dmgBonusMultiplier = 1 + getAttr('dmgBonus%', statMap);

  for (const type of dmgTypes) {
    dmgBonusMultiplier += getAttr(`${type}DmgBonus%`, statMap);
  }

  return dmgBonusMultiplier;
};

export function runDamageFormula(gameId, action, statMap) {
  const { damage, times = 1 } = action;
  const { element, compressed } = damage;
  const bonusTypes = getBonusTypes(gameId, damage);

  let damageValue = computeBase('damage', compressed, statMap);

  damageValue *= getCritMult(statMap);
  damageValue *= dmgBonusMultiplier(statMap, bonusTypes);

  damageValue *= getResMult(gameId, element, statMap);
  damageValue *= getDefMult(gameId, statMap);

  if (gameId === WW) {
    damageValue *= getDmgAmpMult(statMap, bonusTypes);
    damageValue *= 1 + getAttr('vuln%', statMap);
  }

  if (action.type === 'normalAttack') {
    damageValue *= 1 + getAttr('attackSpd%', statMap);
  }

  return damageValue * times;
}
