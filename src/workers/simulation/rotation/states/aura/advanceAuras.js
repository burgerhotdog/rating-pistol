import {
  advanceBloom,
  advanceBurning,
  advanceCharged,
  advanceQuicken,
  advanceStellarConduct,
  advanceStellarSwirl,
  decayElementalAura,
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

export function advanceAuras(ctx, elapsed) {
  const auraStore = ctx.states.aura;
  const hasCharged = Boolean(auraStore.electroCharged || auraStore.lunarCharged);
  const hasBurning = Boolean(auraStore.burning);

  if (hasCharged) advanceCharged(ctx, elapsed);
  if (hasBurning) advanceBurning(ctx, elapsed);

  for (const state of Object.values(auraStore)) {
    if (hasCharged && isHandledByCharged(state)) continue;
    if (hasBurning && isHandledByBurning(state)) continue;

    if (state.element) {
      decayElementalAura(auraStore, state.element, elapsed);
      continue;
    }

    if (state.reaction === 'quicken') {
      advanceQuicken(auraStore, elapsed);
      continue;
    }

    if (state.reaction === 'stellarConduct') {
      advanceStellarConduct(ctx, elapsed);
      continue;
    }

    if (state.reaction === 'stellarSwirl') {
      advanceStellarSwirl(ctx, elapsed);
      continue;
    }

    if (state.reaction === 'bloom') {
      advanceBloom(ctx, state, elapsed);
      continue;
    }

    if (!('timeLeft' in state)) continue;

    const remaining = state.timeLeft -= elapsed;

    if (remaining <= 0) {
      delete auraStore[state.reaction];
    }
  }
}
