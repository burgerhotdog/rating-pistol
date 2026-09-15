import {
  reactOverloaded,
  reactSuperconduct,
  reactSwirl,
} from './transformativeReactions';
import {
  reactMelt,
  reactVaporize,
} from './amplifyingReactions';
import { attemptApplyElement } from './icd';

function applyAura(ctx, element, gauge) {
  const aura = ctx.states.aura[element] ??= { element };

  aura.decayRate ??= ((35 / (4 * gauge)) + (25 / 8)) * 1000;
  aura.gauge = Math.max(aura.gauge ?? 0, gauge * 0.8);
}

function consumeAura(ctx, aura, gauge) {
  const remaining = Math.max(gauge - aura.gauge, 0);
  aura.gauge -= gauge;

  if (aura.gauge <= 0) {
    delete ctx.states.aura[aura.element];
  }

  return remaining;
}

function applyPyro(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.electro) {
    reactOverloaded(ctx, applier);
    consumeAura(ctx, aura.electro, gauge);
    return 1;
  }

  if (aura.cryo) {
    const multiplier = reactMelt(ctx, applier, true);
    consumeAura(ctx, aura.cryo, gauge);
    return multiplier;
  }

  if (aura.hydro) {
    const multiplier = reactVaporize(ctx, applier, true);
    consumeAura(ctx, aura.hydro, gauge);
    return multiplier;
  }

  applyAura(ctx, 'pyro', gauge);
  return 1;
}

function applyElectro(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.pyro) {
    reactOverloaded(ctx, applier);
    consumeAura(ctx, aura.pyro, gauge);
    return 1;
  }

  if (aura.cryo) {
    reactSuperconduct(ctx, applier);
    consumeAura(ctx, aura.cryo, gauge);
    return 1;
  }

  applyAura(ctx, 'electro', gauge);
  return 1;
}

function applyCryo(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.electro) {
    reactSuperconduct(ctx, applier);
    consumeAura(ctx, aura.electro, gauge);
    return 1;
  }

  if (aura.pyro) {
    const multiplier = reactMelt(ctx, applier, false);
    consumeAura(ctx, aura.pyro, gauge);
    return multiplier;
  }

  applyAura(ctx, 'cryo', gauge);
  return 1;
}

function applyHydro(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.pyro) {
    const multiplier = reactVaporize(ctx, applier, false);
    consumeAura(ctx, aura.pyro, gauge);
    return multiplier;
  }

  applyAura(ctx, 'hydro', gauge);
  return 1;
}

function applyAnemo(ctx, gauge, applier) {
  const { aura } = ctx.states;

  let remaining = gauge;

  if (aura.pyro && remaining) {
    reactSwirl(ctx, applier, 'pyro');
    remaining = consumeAura(ctx, aura.pyro, gauge);
  }

  if (aura.electro && remaining) {
    reactSwirl(ctx, applier, 'electro');
    remaining = consumeAura(ctx, aura.electro, gauge);
  }

  if (aura.hydro && remaining) {
    reactSwirl(ctx, applier, 'hydro');
    remaining = consumeAura(ctx, aura.hydro, gauge);
  }

  if (aura.cryo && remaining) {
    reactSwirl(ctx, applier, 'cryo');
    remaining = consumeAura(ctx, aura.cryo, gauge);
  }

  return 1;
}

function applyGeo(ctx, gauge, applier) {
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

export function advanceAuras(ctx, elapsed) {
  for (const state of Object.values(ctx.states.aura)) {
    if (state.reaction) {
      state.timer -= elapsed;

      if (state.timer <= 0) {
        delete ctx.states.aura[state.reaction];
      }
    }

    if (state.element) {
      state.gauge -= elapsed / state.decayRate;

      if (state.gauge <= 0) {
        delete ctx.states.aura[state.element];
      }
    }
  }
}
