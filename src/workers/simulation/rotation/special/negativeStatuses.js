import { getEffectStates } from '../getEffectStates';
import { getBuffMap } from '../getStatMap';
import { getDmgAmpMult } from '../formula/dmgAmp';

const statusMaxStacks = {
  glacioChafe: 10,
  fusionBurst: 10,
  electroFlare: 10,
  aeroErosion: 3,
  spectroFrazzle: 10,
  havocBane: 3,
};

const getStatusMaxStacks = (ctx, statusId) => {
  let override = 0;
  for (const { effect: { gameRule } } of getEffectStates(ctx, { member: 'all', type: 'gameRule' })) {
    if ('maxNegativeStatusStacks' in gameRule) {
      override += gameRule.maxNegativeStatusStacks;
    }
  }
  return statusMaxStacks[statusId] + override;
};

const STATUSES = {
  glacioChafe: {
    id: 'glacioChafe',
    element: 'glacio',
    mv: [2450, 4442, 6434, 8426, 10417, 12409, 14401, 16393, 18385, 20377, 27169, 33961, 40753],
    inflict: (ctx, status, stacks) => {
      const maxStacks = getStatusMaxStacks(ctx, 'glacioChafe');
      const { negativeStatuses } = ctx.states;
      if ('glacioChafe' in negativeStatuses) {
        const currState = negativeStatuses.glacioChafe;
        currState.stacks = Math.min(currState.stacks + stacks, maxStacks);
        currState.timeLeft = 15000;
      } else {
        negativeStatuses.glacioChafe = {
          status,
          stacks: Math.min(stacks, maxStacks),
          timeLeft: 15000,
        };
      }

      const currState = negativeStatuses.glacioChafe;
      if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, currState));
      if (currState.stacks === maxStacks) delete negativeStatuses.glacioChafe;
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const currState = negativeStatuses.glacioChafe;
      currState.timeLeft -= elapsed;
      if (currState.timeLeft <= 0) delete negativeStatuses.glacioChafe;
    },
  },
  fusionBurst: {
    id: 'fusionBurst',
    element: 'fusion',
    mv: [8400, 15229, 22058, 28888, 35717, 42546, 49375, 56204, 63034, 69863, 93150, 116438, 139726],
    inflict: (ctx, status, stacks) => {
      const maxStacks = getStatusMaxStacks(ctx, 'fusionBurst');
      const { negativeStatuses } = ctx.states;
      if ('fusionBurst' in negativeStatuses) {
        const currState = negativeStatuses.fusionBurst;
        currState.stacks = Math.min(currState.stacks + stacks, maxStacks);
        currState.timeLeft = 15000;
      } else {
        negativeStatuses.fusionBurst = {
          status,
          stacks: Math.min(stacks, maxStacks),
          timeLeft: 15000,
        };
      }

      const currState = negativeStatuses.fusionBurst;
      if (currState.stacks === maxStacks) {
        if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, currState));
        delete negativeStatuses.fusionBurst;
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const currState = negativeStatuses.fusionBurst;
      currState.timeLeft -= elapsed;
      if (currState.timeLeft <= 0) {
        delete negativeStatuses.fusionBurst;
      }
    },
  },
  electroFlare: {
    id: 'electroFlare',
    element: 'electro',
    mv: [5000, 9065, 13130, 17195, 21260, 25325, 29390, 33455, 37520, 41585, 55447, 69308, 83170],
    inflict: (ctx, status, stacks) => {
      const maxStacks = getStatusMaxStacks(ctx, 'electroFlare');
      const { negativeStatuses } = ctx.states;
      if ('electroFlare' in negativeStatuses) {
        const currState = negativeStatuses.electroFlare;
        const nextStacks = currState.stacks + stacks;
        currState.stacks = Math.min(nextStacks, maxStacks);
        currState.rage = Math.max(nextStacks - maxStacks, 0);
      } else {
        negativeStatuses.electroFlare = {
          status,
          stacks: Math.min(stacks, maxStacks),
          rage: Math.max(stacks - maxStacks, 0),
          timer: 5000,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const currState = negativeStatuses.electroFlare;
      let remaining = elapsed;
      while (remaining > 0) {
        const decrease = Math.min(currState.timer, remaining);
        currState.timer -= decrease;
        remaining -= decrease;

        if (!currState.timer) {
          if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, currState, elapsed - remaining));

          currState.stacks = Math.floor(currState.stacks / 2);
          currState.timer = 5000;

          if (!currState.stacks) {
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
      const maxStacks = getStatusMaxStacks(ctx, 'aeroErosion');
      const { negativeStatuses } = ctx.states;
      if ('aeroErosion' in negativeStatuses) {
        const currState = negativeStatuses.aeroErosion;
        currState.stacks = Math.min(currState.stacks + stacks, maxStacks);
        currState.timeLeft = 15000;
      } else {
        negativeStatuses.aeroErosion = {
          status,
          stacks: Math.min(stacks, maxStacks),
          timer: 3000,
          timeLeft: 15000,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const currState = negativeStatuses.aeroErosion;
      let remaining = elapsed;
      while (remaining > 0) {
        const decrease = Math.min(currState.timeLeft, currState.timer, remaining);
        currState.timeLeft -= decrease;
        currState.timer -= decrease;
        remaining -= decrease;

        if (currState.timer === 0) {
          if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, currState, elapsed - remaining));

          currState.timer = 3000;
        }

        if (currState.timeLeft === 0) {
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
      const maxStacks = getStatusMaxStacks(ctx, 'spectroFrazzle');
      const { negativeStatuses } = ctx.states;
      if ('spectroFrazzle' in negativeStatuses) {
        const currState = negativeStatuses.spectroFrazzle;
        currState.stacks = Math.min(currState.stacks + stacks, maxStacks);
      } else {
        negativeStatuses.spectroFrazzle = {
          status,
          stacks: Math.min(stacks, maxStacks),
          timer: 3000,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const currState = negativeStatuses.spectroFrazzle;
      let remaining = elapsed;
      while (remaining > 0) {
        const decrease = Math.min(currState.timer, remaining);
        currState.timer -= decrease;
        remaining -= decrease;

        if (!currState.timer) {
          if (ctx.saveSnapshots) ctx.snapshots.push(buildSnapshot(ctx, currState, elapsed - remaining));

          currState.stacks--;
          currState.timer = 3000;

          if (!currState.stacks) {
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
      const maxStacks = getStatusMaxStacks(ctx, 'havocBane');
      const { negativeStatuses } = ctx.states;
      if ('havocBane' in negativeStatuses) {
        const currState = negativeStatuses.havocBane;
        currState.stacks = Math.min(currState.stacks + stacks, maxStacks);
        currState.timeLeft = 15000;
      } else {
        negativeStatuses.havocBane = {
          status,
          stacks: Math.min(stacks, maxStacks),
          timeLeft: 15000,
        };
      }
    },
    advance: (ctx, elapsed) => {
      const { negativeStatuses } = ctx.states;
      const currState = negativeStatuses.havocBane;
      currState.timeLeft -= elapsed;
      if (currState.timeLeft <= 0) {
        delete negativeStatuses.havocBane;
      }
    },
  }
};

export function inflictNegativeStatuses(ctx, action) {
  if (!action.inflictStatus) return;
  for (const [statusId, stacks] of Object.entries(action.inflictStatus)) {
    const status = STATUSES[statusId];
    status.inflict(ctx, status, stacks);
  }
}

export function advanceNegativeStatuses(ctx, elapsed) {
  const { negativeStatuses } = ctx.states;
  for (const statusState of Object.values(negativeStatuses)) {
    const { status } = statusState;
    status.advance(ctx, elapsed);
  }
}

const LEVEL_MODIFIER = 3674;

export const buildSnapshot = (ctx, statusState, runtimeOffset = 0) => {
  const { getDefMult, getResMult } = ctx.helpers;
  const { stacks, rage, status } = statusState;

  const { buffMap } = getBuffMap(ctx);

  const mv = status.mv[stacks - 1];
  const rageMv = rage ? status.mv[rage - 1] : 0;
  const baseDmg = LEVEL_MODIFIER * ((mv + rageMv) / 10000);

  const dmgAmpMult = getDmgAmpMult(buffMap, [status.id]);
  const defMult = getDefMult(buffMap);
  const resMult = getResMult(status.element, buffMap);

  return {
    key: `other:${status.id}`,
    ownerId: 'other',
    type: 'damage',
    dmgType: status.id,
    value: baseDmg * dmgAmpMult * defMult * resMult,
    runtime: ctx.states.runtime + runtimeOffset,
  };
};
