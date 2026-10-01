import { WW } from '@/data';
import { getAttr } from '@/utils';
import { getDmgAmpMult } from './dmgAmp';
import { getDefMult } from './enemyDef';
import { getResMult } from './enemyRes';

const LEVEL_MODIFIER = 3674;

const equivalentTypes = {
  glacioBite: 'glacioChafe',
};

export function runNegativeStatusFormula(action, statMap) {
  const { damage, times = 1 } = action;
  const { type, element, compressed } = damage;

  let damageValue = LEVEL_MODIFIER * compressed.mvs.statusAmp;

  const ampTypes = [type];
  if (type in equivalentTypes) {
    ampTypes.push(equivalentTypes[type]);
  }

  damageValue *= getDmgAmpMult(statMap, ampTypes);
  damageValue *= getDefMult(WW, statMap);
  damageValue *= getResMult(WW, element, statMap);
  damageValue *= 1 + getAttr('vuln%', statMap);

  return damageValue * times;
}
