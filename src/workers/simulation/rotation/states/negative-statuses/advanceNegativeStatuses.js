import { buildSnapshot } from './buildSnapshot';
import { hasGameRule } from '../gameRules';

function advanceGlacioChafe(ctx, state, elapsed) {
  const remaining = state.timeLeft -= elapsed;

  if (remaining <= 0) {
    delete ctx.states.negativeStatuses.glacioChafe;
  }
}

function advanceFusionBurst(ctx, state, elapsed) {
  const remaining = state.timeLeft -= elapsed;

  if (remaining <= 0) {
    delete ctx.states.negativeStatuses.fusionBurst;

    if (hasGameRule(ctx, 'aemeathFusionBurst')) {
      ctx.states.negativeStatuses.fusionBurst = {
        key: 'fusionBurst',
        stacks: 1,
        timeLeft: 15000,
      };
    }
  }
}

function advanceElectroFlare(ctx, state, elapsed) {
  let remaining = elapsed;

  while (remaining > 0) {
    const interval = Math.min(state.timer, remaining);
    remaining -= interval;
    state.timer -= interval;

    if (state.timer === 0) {
      if (ctx.saveSnapshots) {
        const snapshot = buildSnapshot(ctx, state, elapsed - remaining);
        ctx.snapshots.push(snapshot);
      }

      state.stacks = Math.floor(state.stacks / 2);
      state.timer = 5000;

      if (!state.stacks) {
        delete ctx.states.negativeStatuses.electroFlare;
        break;
      }
    }
  }
}

function advanceAeroErosion(ctx, state, elapsed) {
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
        const snapshot = buildSnapshot(ctx, state, elapsed - remaining);
        ctx.snapshots.push(snapshot);
      }

      state.timer = maxTimer;
    }

    if (state.timeLeft === 0) {
      delete ctx.states.negativeStatuses.aeroErosion;
      break;
    }
  }
}

function advanceSpectroFrazzle(ctx, state, elapsed) {
  const heliacalEmberEnabled = hasGameRule(ctx, 'heliacalEmber');

  let remaining = elapsed;

  while (remaining > 0) {
    const interval = Math.min(state.timer, remaining);
    remaining -= interval;
    state.timer -= interval;

    if (state.timer === 0) {
      if (ctx.saveSnapshots && !heliacalEmberEnabled) {
        const snapshot = buildSnapshot(ctx, state, elapsed - remaining);
        ctx.snapshots.push(snapshot);
      }

      state.timer = heliacalEmberEnabled ? 6000 : 3000;

      if (!hasGameRule(ctx, 'shimmer') || heliacalEmberEnabled) {
        state.stacks--;
      }

      if (!state.stacks) {
        delete ctx.states.negativeStatuses.spectroFrazzle;
        break;
      }
    }
  }
}

function advanceHavocBane(ctx, state, elapsed) {
  const remaining = state.timeLeft -= elapsed;

  if (remaining <= 0) {
    delete ctx.states.negativeStatuses.havocBane;
  }
}

export function advanceNegativeStatuses(ctx, elapsed) {
  const store = ctx.states.negativeStatuses;

  for (const state of Object.values(store)) {
    switch (state.key) {
      case 'glacioChafe':
        advanceGlacioChafe(ctx, state, elapsed);
        break;

      case 'fusionBurst':
        advanceFusionBurst(ctx, state, elapsed);
        break;

      case 'electroFlare':
        advanceElectroFlare(ctx, state, elapsed);
        break;

      case 'aeroErosion':
        advanceAeroErosion(ctx, state, elapsed);
        break;

      case 'spectroFrazzle':
        advanceSpectroFrazzle(ctx, state, elapsed);
        break;

      case 'havocBane':
        advanceHavocBane(ctx, state, elapsed);
        break;
    }
  }
}
