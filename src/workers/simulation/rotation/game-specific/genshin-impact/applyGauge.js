import {
  reactOverloaded,
  reactSuperconduct,
  reactSwirl,
  reactCrystallize,
  reactFrozen,
  reactElectroCharged,
} from './transformativeReactions';
import {
  reactMelt,
  reactVaporize,
} from './amplifyingReactions';
import { attemptApplyElement } from './icd';
import { applyAura, consumeAura } from './aura';

function applyPyro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge;

  if (aura.electro && remaining) {
    reactOverloaded(ctx, applier);
    consumeAura(ctx, aura.electro, remaining);
    return 1;
  }

  if (aura.cryo && remaining) {
    const multiplier = reactMelt(ctx, applier, true);
    consumeAura(ctx, aura.cryo, remaining * 2);
    return multiplier;
  }

  if (aura.hydro && remaining) {
    const multiplier = reactVaporize(ctx, applier, false);
    consumeAura(ctx, aura.hydro, remaining / 2);
    return multiplier;
  }

  if (remaining) {
    applyAura(ctx, 'pyro', remaining);
  }

  return 1;
}

function applyElectro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge;

  if (aura.pyro && remaining) {
    reactOverloaded(ctx, applier);
    consumeAura(ctx, aura.pyro, remaining);
    return 1;
  }

  if (aura.cryo && remaining) {
    reactSuperconduct(ctx, applier);
    consumeAura(ctx, aura.cryo, remaining);
    return 1;
  }

  if (remaining) {
    applyAura(ctx, 'electro', remaining);
  }

  if (aura.hydro && remaining) {
    reactElectroCharged(ctx, applier);
  }

  return 1;
}

function applyCryo(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge;

  if (aura.hydro && remaining) {
    reactFrozen(ctx, aura.hydro.gauge, remaining);
    remaining = consumeAura(ctx, aura.hydro, remaining);
  }

  if (aura.electro && remaining) {
    reactSuperconduct(ctx, applier);
    consumeAura(ctx, aura.electro, remaining);
    return 1;
  }

  if (aura.pyro && remaining) {
    const multiplier = reactMelt(ctx, applier, false);
    consumeAura(ctx, aura.pyro, remaining / 2);
    return multiplier;
  }

  if (remaining) {
    applyAura(ctx, 'cryo', remaining);
  }

  return 1;
}

function applyHydro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge;

  if (aura.cryo && remaining) {
    reactFrozen(ctx, aura.cryo.gauge, remaining);
    remaining = consumeAura(ctx, aura.cryo, remaining);
  }

  if (aura.pyro && remaining) {
    const multiplier = reactVaporize(ctx, applier, true);
    consumeAura(ctx, aura.pyro, remaining * 2);
    return multiplier;
  }

  if (remaining) {
    applyAura(ctx, 'hydro', remaining);
  }

  if (aura.electro && remaining) {
    reactElectroCharged(ctx, applier);
  }

  return 1;
}

function applyAnemo(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge / 2;

  if (aura.pyro && remaining) {
    reactSwirl(ctx, applier, 'pyro');
    remaining = consumeAura(ctx, aura.pyro, remaining);
  }

  if (aura.electro && remaining) {
    reactSwirl(ctx, applier, 'electro');
    remaining = consumeAura(ctx, aura.electro, remaining);
  }

  if (aura.hydro && remaining) {
    reactSwirl(ctx, applier, 'hydro');
    remaining = consumeAura(ctx, aura.hydro, remaining);
  }

  if (aura.cryo && remaining) {
    reactSwirl(ctx, applier, 'cryo');
    remaining = consumeAura(ctx, aura.cryo, remaining);
  }

  return 1;
}

function applyGeo(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge / 2;

  if (aura.pyro && remaining) {
    reactCrystallize(ctx, applier, 'pyro');
    remaining = consumeAura(ctx, aura.pyro, remaining);
  }

  if (aura.electro && remaining) {
    reactCrystallize(ctx, applier, 'electro');
    remaining = consumeAura(ctx, aura.electro, remaining);
  }

  if (aura.hydro && remaining) {
    reactCrystallize(ctx, applier, 'hydro');
    remaining = consumeAura(ctx, aura.hydro, remaining);
  }

  if (aura.cryo && remaining) {
    reactCrystallize(ctx, applier, 'cryo');
    remaining = consumeAura(ctx, aura.cryo, remaining);
  }

  return 1;
}

function applyDendro(ctx, gauge, applier) {
  applyAura(ctx, 'dendro', gauge);
  return 1;
}

export function applyGauge(ctx, action) {
  const { element, gauge, icd } = action.damage ?? {};
  if (element === 'physical' || !gauge) return 1;

  if (icd) {
    const attemptSuccess = attemptApplyElement(ctx, action.ownerId, icd);
    if (!attemptSuccess) return 1;
  }

  switch (element) {
    case 'pyro':
      return applyPyro(ctx, gauge, action.ownerId);

    case 'electro':
      return applyElectro(ctx, gauge, action.ownerId);

    case 'cryo':
      return applyCryo(ctx, gauge, action.ownerId);

    case 'hydro':
      return applyHydro(ctx, gauge, action.ownerId);

    case 'anemo':
      return applyAnemo(ctx, gauge, action.ownerId);

    case 'geo':
      return applyGeo(ctx, gauge, action.ownerId);

    case 'dendro':
      return applyDendro(ctx, gauge, action.ownerId);
  }

  return 1;
}
