import { buildSnapshot } from './buildSnapshot';
import { hasGameRule } from '../gameRules';

const getAeroMaxTimer = (ctx) => hasGameRule(ctx, 'mandateOfDivinity') ? 1500 : 3000;

function tickSnapshot(ctx, state) {
  if (ctx.saveSnapshots) {
    ctx.snapshots.push(buildSnapshot(ctx, state));
  }
}

function fireFusionBurst(ctx, state) {
  if (state.timeLeft > 0) return;

  delete ctx.states.negativeStatuses.fusionBurst;

  if (hasGameRule(ctx, 'aemeathFusionBurst')) {
    ctx.states.negativeStatuses.fusionBurst = {
      key: 'fusionBurst',
      stacks: 1,
      timeLeft: 15000,
    };
  }
}

function fireElectroFlare(ctx, state) {
  if (state.timer > 0) return;

  tickSnapshot(ctx, state);

  state.stacks = Math.floor(state.stacks / 2);
  state.timer = 5000;

  if (!state.stacks) {
    delete ctx.states.negativeStatuses.electroFlare;
  }
}

function fireAeroErosion(ctx, state) {
  if (state.timer <= 0) {
    tickSnapshot(ctx, state);
    state.timer = getAeroMaxTimer(ctx);
  }

  if (state.timeLeft <= 0) {
    delete ctx.states.negativeStatuses.aeroErosion;
  }
}

function fireSpectroFrazzle(ctx, state) {
  if (state.timer > 0) return;

  const heliacalEmberEnabled = hasGameRule(ctx, 'heliacalEmber');

  if (!heliacalEmberEnabled) {
    tickSnapshot(ctx, state);
  }

  state.timer = heliacalEmberEnabled ? 6000 : 3000;

  if (!hasGameRule(ctx, 'shimmer') || heliacalEmberEnabled) {
    state.stacks--;
  }

  if (!state.stacks) {
    delete ctx.states.negativeStatuses.spectroFrazzle;
  }
}

export function getNegativeStatusBoundary(ctx) {
  let boundary = Infinity;

  for (const state of Object.values(ctx.states.negativeStatuses)) {
    switch (state.key) {
      case 'glacioChafe':
      case 'fusionBurst':
      case 'havocBane':
        boundary = Math.min(boundary, state.timeLeft);
        break;

      case 'electroFlare':
      case 'spectroFrazzle':
        boundary = Math.min(boundary, state.timer);
        break;

      case 'aeroErosion':
        boundary = Math.min(boundary, state.timeLeft, state.timer, getAeroMaxTimer(ctx));
        break;
    }
  }

  return boundary;
}

export function advanceNegativeStatusTimers(ctx, step) {
  for (const state of Object.values(ctx.states.negativeStatuses)) {
    switch (state.key) {
      case 'glacioChafe':
      case 'fusionBurst':
      case 'havocBane':
        state.timeLeft -= step;
        break;

      case 'electroFlare':
      case 'spectroFrazzle':
        state.timer -= step;
        break;

      case 'aeroErosion':
        state.timer = Math.min(state.timer, getAeroMaxTimer(ctx)) - step;
        state.timeLeft -= step;
        break;
    }
  }
}

export function fireNegativeStatusTicks(ctx) {
  const store = ctx.states.negativeStatuses;

  for (const state of Object.values(store)) {
    if (store[state.key] !== state) continue;

    switch (state.key) {
      case 'glacioChafe':
      case 'havocBane':
        if (state.timeLeft <= 0) delete store[state.key];
        break;

      case 'fusionBurst':
        fireFusionBurst(ctx, state);
        break;

      case 'electroFlare':
        fireElectroFlare(ctx, state);
        break;

      case 'aeroErosion':
        fireAeroErosion(ctx, state);
        break;

      case 'spectroFrazzle':
        fireSpectroFrazzle(ctx, state);
        break;
    }
  }
}
