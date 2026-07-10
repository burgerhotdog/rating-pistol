import { getAttr } from '@/utils';

const LEVEL_MODIFIER = 716.22;
const ENEMY_TYPE_MODIFIER = 14;

export const runTuneFormula = (ctx, enemyStatMap, statMap, tuneAmp = 16, element = 'physical') => {
  const { getDefMult, getResMult } = ctx.helpers;

  const baseDmg = LEVEL_MODIFIER * tuneAmp;
  const defMult = getDefMult(enemyStatMap, statMap);
  const resMult = getResMult(element, enemyStatMap, statMap);

  const tuneBreakBoostMult = 1 + (getAttr('tuneBreakBoost', statMap) / 100);

  const damageValue =
    baseDmg *
    defMult * ENEMY_TYPE_MODIFIER * resMult *
    tuneBreakBoostMult;

  return damageValue;
};
