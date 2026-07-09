import { getCurrentEnemyMap } from './getCurrent';
import { getDmgAmpMult } from './damageFormula/dmgAmp';

const LEVEL_MODIFIER = 3674;

const STATUSES = {
  glacioChafe: {
    id: 'glacioChafe',
    element: 'glacio',
    maxStacks: 10,
    motionValue: [2450, 4442, 6434, 8426, 10417, 12409, 14401, 16393, 18385, 20377, 27169, 33961, 40753],
  },
  fusionBurst: {
    id: 'fusionBurst',
    element: 'fusion',
    maxStacks: 10,
    motionValue: [8400, 15229, 22058, 28888, 35717, 42546, 49375, 56204, 63034, 69863, 93150, 116438, 139726],
  },
  electroFlare: {
    id: 'electroFlare',
    element: 'electro',
    maxStacks: 10,
    motionValue: [5000, 9065, 13130, 17195, 21260, 25325, 29390, 33455, 37520, 41585, 55447, 69308, 83170],
  },
  aeroErosion: {
    id: 'aeroErosion',
    element: 'aero',
    tickInterval: 3000,
    duration: 15000,
    maxStacks: 3,
    motionValue: [4500, 11250, 22500, 33750, 45000, 56250, 67500, 78750, 90000, 101250, 112500, 123750],
  },
  spectroFrazzle: {
    id: 'spectroFrazzle',
    element: 'spectro',
    tickInterval: 3000,
    duration: 3000,
    maxStacks: 10,
    reapply: true,
    motionValue: [3000, 5439, 7878, 10317, 12756, 15195, 17634, 20073, 22512, 24951, 33268, 41585, 49902],
  },
  havocBane: {
    id: 'havocBane',
    element: 'havoc',
    maxStacks: 3,
  }
};

const buildStatusFootprint = (ctx, status, stacks) => {
  const { getDefMult, getResMult } = ctx.helpers;
  const { id, element, motionValue = [] } = status;

  const enemyMap = getCurrentEnemyMap(ctx);

  const baseDmg = LEVEL_MODIFIER * (motionValue[stacks - 1] ?? 0) / 10000;
  const dmgAmpMult = getDmgAmpMult(enemyMap, {}, [id]);
  const defMult = getDefMult(enemyMap);
  const resMult = getResMult(element, enemyMap);

  return {
    key: `other:${id}`,
    ownerId: 'other',
    type: 'damage',
    dmgType: id,
    fixed: baseDmg * dmgAmpMult * defMult * resMult,
  };
};

export function inflictNegativeStatuses(negativeStatuses, statusMap) {
  for (const [statusId, stacks] of Object.entries(statusMap)) {
    const status = STATUSES[statusId];
    const tracker = negativeStatuses[statusId];

    if (!tracker) {
      negativeStatuses[statusId] = {
        stacks: Math.min(stacks, status.maxStacks),
        tickTimer: status.tickInterval,
        duration: status.duration,
        status,
      };
    } else {
      tracker.stacks = Math.min(tracker.stacks + stacks, status.maxStacks);
      tracker.duration = status.duration;
    }
  }
}

export function advanceNegativeStatuses(ctx, elapsed) {
  const { negativeStatuses } = ctx.state;

  for (const [statusId, statusState] of Object.entries(negativeStatuses)) {
    const { status } = statusState;
    let timer = elapsed;

    while (timer > 0) {
      const decrease = Math.min(statusState.duration, statusState.tickTimer, timer);

      statusState.duration -= decrease;
      statusState.tickTimer -= decrease;
      timer -= decrease;

      if (statusState.duration <= 0) {
        if ('reapply' in status) {
          statusState.duration = status.duration;
          statusState.stacks--;

          if (statusState.stacks <= 0) {
            delete negativeStatuses[statusId];
            break;
          }
        } else {
          delete negativeStatuses[statusId];
          break;
        }
      }

      if (statusState.tickTimer <= 0) {
        if (ctx.recordFootprint) {
          const footprint = buildStatusFootprint(ctx, status, statusState.stacks);
          ctx.footprints.push(footprint);
        }

        statusState.tickTimer = status.tickInterval;
      }
    }
  }
}
