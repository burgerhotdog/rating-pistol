import {
  advanceBloomTimers,
  advanceBurningTimers,
  advanceChargedTimers,
  advanceQuicken,
  advanceStellarConductTimers,
  advanceStellarSwirlTimers,
  decayElementalAura,
  fireBloomCores,
  fireBurning,
  fireCharged,
  fireStellarSwirl,
} from './advance';

const isHandledByCharged = (state) =>
  state.reaction === 'electroCharged' ||
  state.reaction === 'lunarCharged' ||
  state.element === 'electro' ||
  state.element === 'hydro';

const isHandledByBurning = (state) =>
  state.reaction === 'burning' ||
  state.element === 'pyro' ||
  state.element === 'dendro';

const hasCharged = (auraStore) => Boolean(auraStore.electroCharged || auraStore.lunarCharged);
const hasBurning = (auraStore) => Boolean(auraStore.burning);

export function getAuraBoundary(ctx) {
  const auraStore = ctx.states.aura;
  const charged = hasCharged(auraStore);
  const burning = hasBurning(auraStore);
  const chargedKey = ctx.cache.lunarCharged ? 'lunarCharged' : 'electroCharged';
  let boundary = Infinity;

  for (const state of Object.values(auraStore)) {
    if (charged && isHandledByCharged(state)) {
      if (state.reaction === chargedKey) {
        boundary = Math.min(boundary, state.timer);
      }
      continue;
    }

    if (burning && isHandledByBurning(state)) {
      if (state.reaction === 'burning') {
        boundary = Math.min(boundary, state.timer);
      }
      continue;
    }

    if (state.element || state.reaction === 'quicken') continue;

    switch (state.reaction) {
      case 'stellarConduct':
        boundary = Math.min(boundary, state.timeLeft, state.timer);
        break;

      case 'stellarSwirl':
        boundary = Math.min(boundary, state.timeLeft, state.vortexTimer);
        break;

      case 'bloom':
        if (state.cores.length) {
          boundary = Math.min(boundary, state.cores[0].timeLeft);
        }
        break;

      default:
        if ('timeLeft' in state) {
          boundary = Math.min(boundary, state.timeLeft);
        }
    }
  }

  return boundary;
}

export function advanceAuraTimers(ctx, step) {
  const auraStore = ctx.states.aura;
  const charged = hasCharged(auraStore);
  const burning = hasBurning(auraStore);

  if (charged) advanceChargedTimers(ctx, step);
  if (burning) advanceBurningTimers(ctx, step);

  for (const state of Object.values(auraStore)) {
    if (charged && isHandledByCharged(state)) continue;
    if (burning && isHandledByBurning(state)) continue;

    if (state.element) {
      decayElementalAura(auraStore, state.element, step);
      continue;
    }

    if (state.reaction === 'quicken') {
      advanceQuicken(auraStore, step);
      continue;
    }

    if (state.reaction === 'stellarConduct') {
      advanceStellarConductTimers(ctx, step);
      continue;
    }

    if (state.reaction === 'stellarSwirl') {
      advanceStellarSwirlTimers(ctx, step);
      continue;
    }

    if (state.reaction === 'bloom') {
      advanceBloomTimers(state, step);
      continue;
    }

    if (!('timeLeft' in state)) continue;

    const remaining = state.timeLeft -= step;

    if (remaining <= 0) {
      delete auraStore[state.reaction];
    }
  }
}

export function fireAuraTicks(ctx) {
  fireCharged(ctx);
  fireBurning(ctx);
  fireStellarSwirl(ctx);
  fireBloomCores(ctx);
}
