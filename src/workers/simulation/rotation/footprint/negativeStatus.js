import { getDmgAmpMult } from '../formula/dmgAmp';

const LEVEL_MODIFIER = 3674;

export const buildNegativeStatusFootprint = (ctx, enemyMap, statusState) => {
  const { getDefMult, getResMult } = ctx.helpers;
  const { stacks, rage, status } = statusState;

  const mv = status.mv[stacks - 1];
  const rageMv = rage ? status.mv[rage - 1] : 0;
  const baseDmg = LEVEL_MODIFIER * ((mv + rageMv) / 10000);

  const dmgAmpMult = getDmgAmpMult(enemyMap, {}, [status.id]);
  const defMult = getDefMult(enemyMap);
  const resMult = getResMult(status.element, enemyMap);

  return {
    key: `other:${status.id}`,
    ownerId: 'other',
    type: 'damage',
    dmgType: status.id,
    fixed: baseDmg * dmgAmpMult * defMult * resMult,
  };
};
