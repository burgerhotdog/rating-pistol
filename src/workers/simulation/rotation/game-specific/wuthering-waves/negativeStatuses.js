import { WW } from '@/data';
import { formatStr } from '@/utils';
import { getEffectStates } from '../../getEffectStates';
import { getBuffMap } from '../../getStatMap';
import { getDmgAmpMult } from '../../formula/dmgAmp';
import { getDefMult } from '../../formula/enemyDef';
import { getResMult } from '../../formula/enemyRes';

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
    mv: [0.245, 0.4442, 0.6434, 0.8426, 1.0417, 1.2409, 1.4401, 1.6393, 1.8385, 2.0377, 2.7169, 3.3961, 4.0753],
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
    mv: [0.84, 1.5229, 2.2058, 2.8888, 3.5717, 4.2546, 4.9375, 5.6204, 6.3034, 6.9863, 9.3150, 11.6438, 13.9726],
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
    mv: [0.5, 0.9065, 1.313, 1.7195, 2.126, 2.5325, 2.939, 3.3455, 3.752, 4.1585, 5.5447, 6.9308, 8.317],
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
    mv: [0.45, 1.125, 2.25, 3.375, 4.5, 5.625, 6.75, 7.875, 9, 10.125, 11.25, 12.375],
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
    mv: [0.3, 0.5439, 0.7878, 1.0317, 1.2756, 1.5195, 1.7634, 2.0073, 2.2512, 2.4951, 3.3268, 4.1585, 4.9902],
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
  const toInflict = action.inflict?.status;
  if (!toInflict) return;

  for (const [id, stacks] of Object.entries(toInflict)) {
    const status = STATUSES[id];
    status.inflict(ctx, stacks);
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
  const store = ctx.states.negativeStatuses;

  for (const state of Object.values(store)) {
    const { status } = state;
    status.advance(ctx, elapsed);
  }
}

const LEVEL_MODIFIER = 3674;

const buildSnapshot = (ctx, statusState, runtimeOffset = 0, fixedMv) => {
  const { stacks, rage, status } = statusState;

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
