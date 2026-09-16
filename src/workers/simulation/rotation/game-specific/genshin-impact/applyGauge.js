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
import { tryApplyElement } from './icd';
import { applyAura, consumeAura } from './aura';

function applyPyro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge;

  if (aura.electro && remaining) {
    reactOverloaded(ctx, applier);
    consumeAura(ctx, aura.electro, remaining);
    return;
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
}

function applyElectro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let remaining = gauge;

  if (aura.pyro && remaining) {
    reactOverloaded(ctx, applier);
    consumeAura(ctx, aura.pyro, remaining);
    return;
  }

  if (aura.cryo && remaining) {
    reactSuperconduct(ctx, applier);
    consumeAura(ctx, aura.cryo, remaining);
    return;
  }

  if (remaining) {
    applyAura(ctx, 'electro', remaining);
  }

  if (aura.hydro && remaining) {
    reactElectroCharged(ctx, applier);
  }
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
    return;
  }

  if (aura.pyro && remaining) {
    const multiplier = reactMelt(ctx, applier, false);
    consumeAura(ctx, aura.pyro, remaining / 2);
    return multiplier;
  }

  if (remaining) {
    applyAura(ctx, 'cryo', remaining);
  }
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
}

function applyDendro(ctx, gauge, applier) {
  applyAura(ctx, 'dendro', gauge);
}

export function applyGauge(ctx, action) {
  const { damage, ownerId } = action;
  if (!damage) return;

  const { element, gauge, icd } = damage;
  if (element === 'physical' || !gauge) return;
  if (!tryApplyElement(ctx, ownerId, icd)) return;

  switch (element) {
    case 'pyro':
      return applyPyro(ctx, gauge, ownerId);

    case 'electro':
      return applyElectro(ctx, gauge, ownerId);

    case 'cryo':
      return applyCryo(ctx, gauge, ownerId);

    case 'hydro':
      return applyHydro(ctx, gauge, ownerId);

    case 'anemo':
      return applyAnemo(ctx, gauge, ownerId);

    case 'geo':
      return applyGeo(ctx, gauge, ownerId);

    case 'dendro':
      return applyDendro(ctx, gauge, ownerId);
  }
}
