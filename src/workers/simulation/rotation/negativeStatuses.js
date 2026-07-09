import { getCurrentEnemyMap } from './getCurrent';
import { getDmgAmpMult } from './damageFormula/dmgAmp';

const LEVEL_MODIFIER = 3674;

const STATUSES = {
  glacioChafe: {
    id: 'glacioChafe',
    element: 'glacio',
    maxStacks: 10,
    mv: [2450, 4442, 6434, 8426, 10417, 12409, 14401, 16393, 18385, 20377, 27169, 33961, 40753],
    inflict: (ctx, status, stacks) => {
      const { negativeStatuses } = ctx.state;
      const prev = negativeStatuses.glacioChafe;

      if (prev) {
        prev.stacks = Math.min(prev.stacks + stacks, 10);
        prev.duration = 15000;
      } else {
        negativeStatuses.glacioChafe = {
          stacks: Math.min(stacks, 10),
          duration: 15000,
          status,
        };
      }

      if (ctx.recordFootprint) {
        const footprint = buildStatusFootprint(ctx, negativeStatuses.glacioChafe);
        ctx.footprints.push(footprint);
      }

      if (negativeStatuses.glacioChafe.stacks === 10) {
        delete negativeStatuses.glacioChafe;
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.state;
      const state = negativeStatuses.glacioChafe;
      state.duration -= elapsed;
      if (state.duration <= 0) {
        delete negativeStatuses.glacioChafe;
      }
    },
  },
  fusionBurst: {
    id: 'fusionBurst',
    element: 'fusion',
    mv: [8400, 15229, 22058, 28888, 35717, 42546, 49375, 56204, 63034, 69863, 93150, 116438, 139726],
    inflict: (ctx, status, stacks) => {
      const { negativeStatuses } = ctx.state;
      const prev = negativeStatuses.fusionBurst;

      if (prev) {
        prev.stacks = Math.min(prev.stacks + stacks, 10);
        prev.duration = 15000;
      } else {
        negativeStatuses.fusionBurst = {
          stacks: Math.min(stacks, 10),
          duration: 15000,
          status,
        };
      }

      if (negativeStatuses.fusionBurst.stacks === 10) {
        if (ctx.recordFootprint) {
          const footprint = buildStatusFootprint(ctx, negativeStatuses.fusionBurst);
          ctx.footprints.push(footprint);
        }
        delete negativeStatuses.fusionBurst;
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.state;
      const state = negativeStatuses.fusionBurst;
      state.duration -= elapsed;
      if (state.duration <= 0) {
        delete negativeStatuses.fusionBurst;
      }
    },
  },
  electroFlare: {
    id: 'electroFlare',
    element: 'electro',
    mv: [5000, 9065, 13130, 17195, 21260, 25325, 29390, 33455, 37520, 41585, 55447, 69308, 83170],
    inflict: (ctx, status, stacks) => {
      const { negativeStatuses } = ctx.state;
      const prev = negativeStatuses.electroFlare;

      if (prev) {
        const nextStacks = prev.stacks + stacks;
        prev.stacks = Math.min(nextStacks, 10);
        prev.rage = Math.max(nextStacks - 10, 0);
      } else {
        negativeStatuses.electroFlare = {
          stacks: Math.min(stacks, 10),
          rage: Math.max(stacks - 10, 0),
          timer: 5000,
          status,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.state;
      const state = negativeStatuses.electroFlare;
      let remaining = elapsed;

      while (remaining > 0) {
        const decrease = Math.min(state.timer, remaining);
        state.timer -= decrease;
        remaining -= decrease;

        if (!state.timer) {
          if (ctx.recordFootprint) {
            const footprint = buildStatusFootprint(ctx, state);
            ctx.footprints.push(footprint);
          }

          state.stacks = Math.floor(state.stacks / 2);
          state.timer = 5000;

          if (!state.stacks) {
            delete negativeStatuses.electroFlare;
            break;
          }
        }
      }
    },
  },
  aeroErosion: {
    id: 'aeroErosion',
    element: 'aero',
    mv: [4500, 11250, 22500, 33750, 45000, 56250, 67500, 78750, 90000, 101250, 112500, 123750],
    inflict: (ctx, status, stacks) => {
      const { negativeStatuses } = ctx.state;
      const prev = negativeStatuses.aeroErosion;

      if (prev) {
        prev.stacks = Math.min(prev.stacks + stacks, 3);
        prev.duration = 15000;
      } else {
        negativeStatuses.aeroErosion = {
          stacks: Math.min(stacks, 3),
          timer: 3000,
          duration: 15000,
          status,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.state;
      const state = negativeStatuses.aeroErosion;
      let remaining = elapsed;

      while (remaining > 0) {
        const decrease = Math.min(state.duration, state.timer, remaining);
        state.duration -= decrease;
        state.timer -= decrease;
        remaining -= decrease;

        if (state.timer === 0) {
          if (ctx.recordFootprint) {
            const footprint = buildStatusFootprint(ctx, state);
            ctx.footprints.push(footprint);
          }

          state.timer = 3000;
        }

        if (state.duration === 0) {
          delete negativeStatuses.aeroErosion;
          break;
        }
      }
    },
  },
  spectroFrazzle: {
    id: 'spectroFrazzle',
    element: 'spectro',
    mv: [3000, 5439, 7878, 10317, 12756, 15195, 17634, 20073, 22512, 24951, 33268, 41585, 49902],
    inflict: (ctx, status, stacks) => {
      const { negativeStatuses } = ctx.state;
      const prev = negativeStatuses.spectroFrazzle;

      if (prev) {
        prev.stacks = Math.min(prev.stacks + stacks, 10);
      } else {
        negativeStatuses.spectroFrazzle = {
          stacks: Math.min(stacks, 10),
          timer: 3000,
          status,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.state;
      const state = negativeStatuses.spectroFrazzle;
      let remaining = elapsed;

      while (remaining > 0) {
        const decrease = Math.min(state.timer, remaining);
        state.timer -= decrease;
        remaining -= decrease;

        if (!state.timer) {
          if (ctx.recordFootprint) {
            const footprint = buildStatusFootprint(ctx, state);
            ctx.footprints.push(footprint);
          }

          state.stacks--;
          state.timer = 3000;

          if (!state.stacks) {
            delete negativeStatuses.spectroFrazzle;
            break;
          }
        }
      }
    },
  },
  havocBane: {
    id: 'havocBane',
    element: 'havoc',
    inflict: (ctx, status, stacks) => {
      const { negativeStatuses } = ctx.state;
      const prev = negativeStatuses.havocBane;

      if (prev) {
        prev.stacks = Math.min(prev.stacks + stacks, 3);
        prev.duration = 15000;
      } else {
        negativeStatuses.havocBane = {
          stacks: Math.min(stacks, 3),
          duration: 15000,
          status,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.state;
      const state = negativeStatuses.havocBane;
      state.duration -= elapsed;
      if (state.duration <= 0) {
        delete negativeStatuses.havocBane;
      }
    },
  }
};

const buildStatusFootprint = (ctx, statusState) => {
  const { getDefMult, getResMult } = ctx.helpers;
  const { stacks, rage, status } = statusState;

  const enemyMap = getCurrentEnemyMap(ctx);

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

export function inflictNegativeStatuses(ctx, statusMap) {
  for (const [statusId, stacks] of Object.entries(statusMap)) {
    const status = STATUSES[statusId];
    status.inflict(ctx, status, stacks);
  }
}

export function advanceNegativeStatuses(ctx, elapsed) {
  const { negativeStatuses } = ctx.state;

  for (const statusState of Object.values(negativeStatuses)) {
    const { status } = statusState;
    status.advance(ctx, elapsed);
  }
}
