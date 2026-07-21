import { getAttr } from '@/utils';

const LEVEL_MODIFIER = 716.22;
const ENEMY_TYPE_MODIFIER = 14;

export const runTuneFormula = (helpers, action, enemyMap, statMap) => {
  const { getDefMult, getResMult } = helpers;
  const tuneAmp = action?.compressed?.mvs?.['tuneAmp'] ?? 16;
  const element = action.element ?? 'physical';

  const baseDmg = LEVEL_MODIFIER * tuneAmp;
  const defMult = getDefMult(enemyMap, statMap);
  const resMult = getResMult(element, enemyMap, statMap);

  const tuneBreakBoostMult = 1 + (getAttr('tuneBreakBoost', statMap) / 100);

  const damageValue =
    baseDmg *
    defMult * ENEMY_TYPE_MODIFIER * resMult *
    tuneBreakBoostMult;

  return damageValue;
};
