import { WW } from '@/data';
import { getAttr } from '@/utils';
import { getDefMult } from './enemyDef';
import { getResMult } from './enemyRes';

const LEVEL_MODIFIER = 716.22;
const ENEMY_TYPE_MODIFIER = 14;

export function runTuneFormula(statMap, tuneAmp, element) {
  let tuneValue = LEVEL_MODIFIER * ENEMY_TYPE_MODIFIER;
  tuneValue *= tuneAmp * (1 + getAttr('tuneMv%', statMap));

  tuneValue *= getDefMult(WW, statMap);
  tuneValue *= getResMult(WW, element, statMap);

  tuneValue *= 1 + (getAttr('tuneBreakBoost', statMap) / 100);
  tuneValue *= 1 + getAttr('vuln%', statMap);

  return tuneValue;
}
