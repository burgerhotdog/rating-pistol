import { formatStr } from '@/utils';
import { getEffectStates } from '../getEffectStates';
import { getBuffMap } from '../getStatMap';
import { getDmgAmpMult } from '../formula/dmgAmp';
import { getDefMult } from '../formula/enemyDef';
import { getResMult } from '../formula/enemyRes';

const statusMaxStacks = {
  glacioChafe: 10,
  fusionBurst: 10,
  electroFlare: 10,
  aeroErosion: 3,
  spectroFrazzle: 10,
  havocBane: 3,
};

function hasGameRule(ctx, key) {
  for (const state of getEffectStates(ctx, { member: 'all', type: 'gameRule' })) {
    if (state.effect.gameRule === key) return true;
  }
}

function getStatusMaxStacks(ctx, statusId) {
  let maxStacks = statusMaxStacks[statusId];

  for (const state of getEffectStates(ctx, { member: 'all', type: 'gameRule' })) {
    const gameRuleKey = state.effect.gameRule;

    if (gameRuleKey === 'roverAero2' && statusId !== 'aeroErosion') {
      maxStacks += 3;
    }

    if (gameRuleKey === 'chisa') {
      maxStacks += 3;
    }

    if (gameRuleKey === 'suisui' && statusId !== 'havocBane') {
      maxStacks += 3;
    }
  }

  return maxStacks;
}

const STATUSES = {
  glacioChafe: {
    id: 'glacioChafe',
    element: 'glacio',
    mv: [2450, 4442, 6434, 8426, 10417, 12409, 14401, 16393, 18385, 20377, 27169, 33961, 40753],
    inflict: (ctx, stacks) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.glacioChafe ??= {
        status: STATUSES.glacioChafe,
        stacks: 0,
        timeLeft: 15000,
      };

      const maxStacks = getStatusMaxStacks(ctx, 'glacioChafe');
      state.stacks = Math.min(state.stacks + stacks, maxStacks);
      state.timeLeft = 15000;

      if (ctx.saveSnapshots) {
        const snapshotState = hasGameRule(ctx, 'glacioBite')
          ? { ...state, stacks: maxStacks }
          : state;
        ctx.snapshots.push(buildSnapshot(ctx, snapshotState));
      }

      if (state.stacks === maxStacks) {
        delete negativeStatuses.glacioChafe;
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.glacioChafe;

      state.timeLeft -= elapsed;
      if (state.timeLeft <= 0) {
        delete negativeStatuses.glacioChafe;
      }
    },
  },
  fusionBurst: {
    id: 'fusionBurst',
    element: 'fusion',
    mv: [8400, 15229, 22058, 28888, 35717, 42546, 49375, 56204, 63034, 69863, 93150, 116438, 139726],
    inflict: (ctx, stacks) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.fusionBurst ??= {
        status: STATUSES.fusionBurst,
        stacks: 0,
        timeLeft: 15000,
      };

      const maxStacks = getStatusMaxStacks(ctx, 'fusionBurst');
      state.stacks = Math.min(state.stacks + stacks, maxStacks);
      state.timeLeft = 15000;

      const stacksToPop = hasGameRule(ctx, 'aemeathFusionBurst') ? 5 : maxStacks;
      if (state.stacks >= stacksToPop) {
        state.stacks = maxStacks;

        if (ctx.saveSnapshots) {
          ctx.snapshots.push(buildSnapshot(ctx, state));
        }

        delete negativeStatuses.fusionBurst;

        if (hasGameRule(ctx, 'aemeathFusionBurst')) {
          negativeStatuses.fusionBurst = {
            status: STATUSES.fusionBurst,
            stacks: 1,
            timeLeft: 15000,
          };
        }
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.fusionBurst;

      state.timeLeft -= elapsed;
      if (state.timeLeft <= 0) {
        delete negativeStatuses.fusionBurst;

        if (hasGameRule(ctx, 'aemeathFusionBurst')) {
          negativeStatuses.fusionBurst = {
            status: STATUSES.fusionBurst,
            stacks: 1,
            timeLeft: 15000,
          };
        }
      }
    },
  },
  electroFlare: {
    id: 'electroFlare',
    element: 'electro',
    mv: [5000, 9065, 13130, 17195, 21260, 25325, 29390, 33455, 37520, 41585, 55447, 69308, 83170],
    inflict: (ctx, stacks) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.electroFlare ??= {
        status: STATUSES.electroFlare,
        stacks: 0,
        rage: 0,
        timer: 5000,
      };

      const maxStacks = getStatusMaxStacks(ctx, 'electroFlare');
      const excess = Math.max(state.stacks + stacks - maxStacks, 0);
      state.stacks = Math.min(state.stacks + stacks, maxStacks);
      state.rage = Math.min(state.rage + excess, maxStacks);
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.electroFlare;

      let remaining = elapsed;
      while (remaining > 0) {
        const interval = Math.min(state.timer, remaining);
        remaining -= interval;
        state.timer -= interval;

        if (state.timer === 0) {
          if (ctx.saveSnapshots) {
            ctx.snapshots.push(buildSnapshot(ctx, state, elapsed - remaining));
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
    inflict: (ctx, stacks) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.aeroErosion ??= {
        status: STATUSES.aeroErosion,
        stacks: 0,
        timer: hasGameRule(ctx, 'mandateOfDivinity') ? 1500 : 3000,
        timeLeft: 15000,
      };

      const maxStacks = getStatusMaxStacks(ctx, 'aeroErosion');
      state.stacks = Math.min(state.stacks + stacks, maxStacks);
      state.timeLeft = 15000;
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.aeroErosion;

      const maxTimer = hasGameRule(ctx, 'mandateOfDivinity') ? 1500 : 3000;
      if (state.timer > maxTimer) {
        state.timer = maxTimer;
      }

      let remaining = elapsed;
      while (remaining > 0) {
        const interval = Math.min(state.timeLeft, state.timer, remaining);
        remaining -= interval;
        state.timer -= interval;
        state.timeLeft -= interval;

        if (state.timer === 0) {
          if (ctx.saveSnapshots) {
            ctx.snapshots.push(buildSnapshot(ctx, state, elapsed - remaining));
          }

          state.timer = maxTimer;
        }

        if (state.timeLeft === 0) {
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
    inflict: (ctx, stacks) => {
      const heliacalEmberEnabled = hasGameRule(ctx, 'heliacalEmber');
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.spectroFrazzle ??= {
        status: STATUSES.spectroFrazzle,
        stacks: 0,
        timer: heliacalEmberEnabled ? 6000 : 3000,
      };

      const maxStacks = heliacalEmberEnabled
        ? 60
        : getStatusMaxStacks(ctx, 'spectroFrazzle');
      state.stacks = Math.min(state.stacks + stacks, maxStacks);

      if (ctx.saveSnapshots && heliacalEmberEnabled) {
        ctx.snapshots.push(buildSnapshot(ctx, { ...state, stacks }));
      }
    },
    advance: (ctx, elapsed) => {
      const heliacalEmberEnabled = hasGameRule(ctx, 'heliacalEmber');
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.spectroFrazzle;

      let remaining = elapsed;
      while (remaining > 0) {
        const interval = Math.min(state.timer, remaining);
        remaining -= interval;
        state.timer -= interval;

        if (state.timer === 0) {
          if (ctx.saveSnapshots && !heliacalEmberEnabled) {
            ctx.snapshots.push(buildSnapshot(ctx, state, elapsed - remaining));
          }

          state.timer = heliacalEmberEnabled ? 6000 : 3000;

          if (!hasGameRule(ctx, 'shimmer') || heliacalEmberEnabled) {
            state.stacks--;
          }

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
    inflict: (ctx, stacks) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.havocBane ??= {
        status: STATUSES.havocBane,
        stacks: 0,
        timeLeft: 15000,
      };

      const maxStacks = getStatusMaxStacks(ctx, 'havocBane');
      state.stacks = Math.min(state.stacks + stacks, maxStacks);
      state.timeLeft = 15000;
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const state = negativeStatuses.havocBane;

      state.timeLeft -= elapsed;
      if (state.timeLeft <= 0) {
        delete negativeStatuses.havocBane;
      }
    },
  }
};

export function consumeNegativeStatuses(ctx, action) {
  const store = ctx.states.negativeStatuses;
  const toConsume = action.consume?.status ?? {};

  for (const [id, stacks] of Object.entries(toConsume)) {
    const state = store[id];
    if (!state) continue;

    state.stacks -= stacks;
    if (state.stacks <= 0) {
      delete store[id];
    }
  }
}

export function inflictNegativeStatuses(ctx, action) {
  const toInflict = action.inflict?.status ?? {};

  for (const [id, stacks] of Object.entries(toInflict)) {
    const status = STATUSES[id];
    status.inflict(ctx, stacks);

    if ( // Hiyuki 2 special handling
      id === 'glacioChafe' &&
      action.ownerId === '1108' &&
      hasGameRule(ctx, 'hiyuki2') &&
      ctx.saveSnapshots
    ) {
      const snapshot = buildSnapshot(ctx, { status: STATUSES.glacioChafe }, 0, 10200 * stacks);
      ctx.snapshots.push(snapshot);
    }
  }
}

export function replaceNegativeStatuses(ctx, action) {
  const store = ctx.states.negativeStatuses;
  const toReplace = action.replace?.status ?? {};

  for (const [fromId, toId] of Object.entries(toReplace)) {
    const fromState = store[fromId];
    if (!fromState) continue;

    const fromStacks = fromState.stacks;
    delete store[fromId];

    const toStatus = STATUSES[toId];
    toStatus.inflict(ctx, toStatus, fromStacks);
  }
}

export function advanceNegativeStatuses(ctx, elapsed) {
  const toAdvance = ctx.states.negativeStatuses;

  for (const state of Object.values(toAdvance)) {
    const { status } = state;
    status.advance(ctx, elapsed);
  }
}

const LEVEL_MODIFIER = 3674;

export const buildSnapshot = (ctx, statusState, runtimeOffset = 0, fixedMv) => {
  const { stacks, rage, status } = statusState;

  const { buffMap } = getBuffMap(ctx);

  const mv = fixedMv ?? status.mv[stacks - 1];
  const rageMv = rage ? status.mv[rage - 1] : 0;
  const baseDmg = LEVEL_MODIFIER * ((mv + rageMv) / 10000);

  const dmgAmpMult = getDmgAmpMult(buffMap, [status.id]);
  const defMult = getDefMult(ctx.cache.gameId, buffMap);
  const resMult = getResMult(ctx.cache.gameId, status.element, buffMap);

  return {
    id: `other:${status.id}`,
    ownerId: 'other',
    name: formatStr(status.id),
    type: 'negativeStatus',
    damageType: status.id,
    damage: baseDmg * dmgAmpMult * defMult * resMult,
    runtime: ctx.states.runtime + runtimeOffset,
  };
};
