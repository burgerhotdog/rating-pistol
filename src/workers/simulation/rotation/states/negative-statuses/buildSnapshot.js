import { WW } from '@/data';
import { formatStr } from '@/utils';
import { getBuffMap } from '../../getStatMap';
import { getDmgAmpMult } from '../../formula/dmgAmp';
import { getDefMult } from '../../formula/enemyDef';
import { getResMult } from '../../formula/enemyRes';

const LEVEL_MODIFIER = 3674;

const STATUSES = {
  glacioChafe: {
    id: 'glacioChafe',
    element: 'glacio',
    mv: [0.245, 0.4442, 0.6434, 0.8426, 1.0417, 1.2409, 1.4401, 1.6393, 1.8385, 2.0377, 2.7169, 3.3961, 4.0753],
  },
  fusionBurst: {
    id: 'fusionBurst',
    element: 'fusion',
    mv: [0.84, 1.5229, 2.2058, 2.8888, 3.5717, 4.2546, 4.9375, 5.6204, 6.3034, 6.9863, 9.3150, 11.6438, 13.9726],
  },
  electroFlare: {
    id: 'electroFlare',
    element: 'electro',
    mv: [0.5, 0.9065, 1.313, 1.7195, 2.126, 2.5325, 2.939, 3.3455, 3.752, 4.1585, 5.5447, 6.9308, 8.317],
  },
  aeroErosion: {
    id: 'aeroErosion',
    element: 'aero',
    mv: [0.45, 1.125, 2.25, 3.375, 4.5, 5.625, 6.75, 7.875, 9, 10.125, 11.25, 12.375],
  },
  spectroFrazzle: {
    id: 'spectroFrazzle',
    element: 'spectro',
    mv: [0.3, 0.5439, 0.7878, 1.0317, 1.2756, 1.5195, 1.7634, 2.0073, 2.2512, 2.4951, 3.3268, 4.1585, 4.9902],
  },
  havocBane: {
    id: 'havocBane',
    element: 'havoc',
  }
};

export const buildSnapshot = (ctx, statusState, runtimeOffset = 0, fixedMv) => {
  const { key, stacks, rage } = statusState;
  const status = STATUSES[key];

  const { buffMap } = getBuffMap(ctx);

  const mv = fixedMv ?? status.mv[stacks - 1];
  const rageMv = rage ? status.mv[rage - 1] : 0;
  const baseDmg = LEVEL_MODIFIER * (mv + rageMv);

  const dmgAmpMult = getDmgAmpMult(buffMap, [status.id]);
  const defMult = getDefMult(WW, buffMap);
  const resMult = getResMult(WW, status.element, buffMap);

  return {
    id: `system:${status.id}`,
    ownerId: 'system',
    name: formatStr(status.id),
    type: 'negativeStatus',
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime + runtimeOffset,
    damageType: status.id,
    damage: baseDmg * dmgAmpMult * defMult * resMult,
  };
};
