import { WW } from '@/data';
import { clamp, getAttr } from '@/utils';
import { computeBase } from './computeBase';
import { getDmgAmpMult } from './dmgAmp';
import { getDefMult } from './enemyDef';
import { getResMult } from './enemyRes';

const critMultiplier = (statMap) => {
  const critRate = clamp(getAttr('critRate%', statMap), 0, 1);
  const critDamage = getAttr('critDmg%', statMap);

  return critRate * (1 + critDamage) + (1 - critRate);
};

const dmgBonusMultiplier = (statMap, dmgTypes) => {
  const dmgBonus = getAttr('dmgBonus%', statMap);
  const typeDmgBonus = dmgTypes.reduce((acc, type) => acc + getAttr(`${type}DmgBonus%`, statMap), 0);

  return 1 + dmgBonus + typeDmgBonus;
};

export function runDamageFormula(gameId, action, statMap) {
  const { damage, times = 1 } = action;
  const { type, extraType, element, compressed } = damage;
  const bonusTypes = [element, type, ...(extraType ? [extraType] : [])];

  let damageValue = computeBase('damage', compressed, statMap);

  damageValue *= critMultiplier(statMap);
  damageValue *= dmgBonusMultiplier(statMap, bonusTypes);
  damageValue *= getDmgAmpMult(statMap, bonusTypes);

  damageValue *= getResMult(gameId, element, statMap);
  damageValue *= getDefMult(gameId, statMap);

  if (gameId === WW) {
    damageValue *= 1 + getAttr('vuln%', statMap);
  }

  if (action.type === 'normalAttack') {
    damageValue *= 1 + getAttr('attackSpd%', statMap);
  }

  return damageValue * times;
}
