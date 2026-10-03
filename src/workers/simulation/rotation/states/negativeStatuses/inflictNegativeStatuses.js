import { buildSnapshot } from './buildSnapshot';
import { getStackLimit } from './getStackLimit';
import { hasGameRule } from '../gameRules';

function inflictGlacioChafe(ctx, stacks) {
  const stackLimit = getStackLimit(ctx, 'glacioChafe');

  const state = ctx.states.negativeStatuses.glacioChafe ??= {
    key: 'glacioChafe',
    stacks: 0,
    timeLeft: 15000,
  };

  state.stacks = Math.min(state.stacks + stacks, stackLimit);
  state.timeLeft = 15000;

  if (ctx.saveSnapshots) {
    const glacioBiteEnabled = hasGameRule(ctx, 'glacioBite');
    const snapshotState = glacioBiteEnabled ? { ...state, stacks: stackLimit } : state;
    const snapshot = buildSnapshot(ctx, snapshotState);
    ctx.snapshots.push(snapshot);
  }

  if (state.stacks === stackLimit) {
    delete ctx.states.negativeStatuses.glacioChafe;
  }
}

function inflictFusionBurst(ctx, stacks) {
  const stackLimit = getStackLimit(ctx, 'fusionBurst');
  const aemeathFusionBurstEnabled = hasGameRule(ctx, 'aemeathFusionBurst');
  const stacksToPop = aemeathFusionBurstEnabled ? 5 : stackLimit;

  const state = ctx.states.negativeStatuses.fusionBurst ??= {
    key: 'fusionBurst',
    stacks: 0,
    timeLeft: 15000,
  };

  state.stacks = Math.min(state.stacks + stacks, stackLimit);
  state.timeLeft = 15000;

  if (state.stacks >= stacksToPop) {
    state.stacks = stackLimit;

    if (ctx.saveSnapshots) {
      const snapshot = buildSnapshot(ctx, state);
      ctx.snapshots.push(snapshot);
    }

    delete ctx.states.negativeStatuses.fusionBurst;

    if (aemeathFusionBurstEnabled) {
      ctx.states.negativeStatuses.fusionBurst = {
        key: 'fusionBurst',
        stacks: 1,
        timeLeft: 15000,
      };
    }
  }
}

function inflictElectroFlare(ctx, stacks) {
  const stackLimit = getStackLimit(ctx, 'electroFlare');

  const state = ctx.states.negativeStatuses.electroFlare ??= {
    key: 'electroFlare',
    stacks: 0,
    rage: 0,
    timer: 5000,
  };

  const excess = Math.max(state.stacks + stacks - stackLimit, 0);
  state.stacks = Math.min(state.stacks + stacks, stackLimit);
  state.rage = Math.min(state.rage + excess, stackLimit);
}

function inflictAeroErosion(ctx, stacks) {
  const stackLimit = getStackLimit(ctx, 'aeroErosion');

  const state = ctx.states.negativeStatuses.aeroErosion ??= {
    key: 'aeroErosion',
    stacks: 0,
    timer: hasGameRule(ctx, 'mandateOfDivinity') ? 1500 : 3000,
    timeLeft: 15000,
  };

  state.stacks = Math.min(state.stacks + stacks, stackLimit);
  state.timeLeft = 15000;
}

function inflictSpectroFrazzle(ctx, stacks) {
  const heliacalEmberEnabled = hasGameRule(ctx, 'heliacalEmber');
  const stackLimit = heliacalEmberEnabled ? 60 : getStackLimit(ctx, 'spectroFrazzle');

  const state = ctx.states.negativeStatuses.spectroFrazzle ??= {
    key: 'spectroFrazzle',
    stacks: 0,
    timer: heliacalEmberEnabled ? 6000 : 3000,
  };

  state.stacks = Math.min(state.stacks + stacks, stackLimit);

  if (heliacalEmberEnabled && ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, { ...state, stacks });
    ctx.snapshots.push(snapshot);
  }
}

function inflictHavocBane(ctx, stacks) {
  const stackLimit = getStackLimit(ctx, 'havocBane');

  const state = ctx.states.negativeStatuses.havocBane ??= {
    key: 'havocBane',
    stacks: 0,
    timeLeft: 15000,
  };

  state.stacks = Math.min(state.stacks + stacks, stackLimit);
  state.timeLeft = 15000;
}

export function inflictStatus(ctx, statusKey, stacks) {
  switch (statusKey) {
    case 'glacioChafe':
      inflictGlacioChafe(ctx, stacks);
      break;

    case 'fusionBurst':
      inflictFusionBurst(ctx, stacks);
      break;

    case 'electroFlare':
      inflictElectroFlare(ctx, stacks);
      break;

    case 'aeroErosion':
      inflictAeroErosion(ctx, stacks);
      break;

    case 'spectroFrazzle':
      inflictSpectroFrazzle(ctx, stacks);
      break;

    case 'havocBane':
      inflictHavocBane(ctx, stacks);
      break;
  }
}

export function inflictNegativeStatuses(ctx, action) {
  const toInflict = action.inflict?.status;
  if (!toInflict) return;

  for (const statusKey in toInflict) {
    const stacks = toInflict[statusKey];
    inflictStatus(ctx, statusKey, stacks);
  }
}
