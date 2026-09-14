import { reactOverloaded } from './transformativeReactions';

function applyAura(ctx, element, gauge) {
  const aura = ctx.states.aura[element] ??= { element };

  aura.decayRate ??= ((35 / (4 * gauge)) + (25 / 8)) * 1000;
  aura.gauge = Math.max(aura.gauge ?? 0, gauge * 0.8);
}

function reactSuperconduct(ctx, aura, gauge) {
  aura.gauge -= gauge;

  if (aura.gauge <= 0) {
    delete ctx.states.aura[aura.element];
  }
}

function applyPyro(ctx, gauge, ownerId) {
  if (ctx.states.aura.electro) {
    reactOverloaded(ctx, ctx.states.aura.electro, gauge, ownerId);
    return;
  }

  applyAura(ctx, 'pyro', gauge);
}

function applyElectro(ctx, gauge, ownerId) {
  if (ctx.states.aura.pyro) {
    reactOverloaded(ctx, ctx.states.aura.pyro, gauge, ownerId);
    return;
  }

  if (ctx.states.aura.cryo) {
    reactSuperconduct(ctx, ctx.states.aura.cryo, gauge);
    return;
  }

  applyAura(ctx, 'electro', gauge);
}

function applyCryo(ctx, gauge, ownerId) {
  if (ctx.states.aura.electro) {
    reactSuperconduct(ctx, ctx.states.aura.electro, gauge);
    return;
  }

  applyAura(ctx, 'cryo', gauge);
}

function applyHydro(ctx, gauge, ownerId) {
  applyAura(ctx, 'hydro', gauge);
}

function applyAnemo(ctx, gauge, ownerId) {
}

function applyGeo(ctx, gauge, ownerId) {
}

function applyDendro(ctx, gauge, ownerId) {
  applyAura(ctx, 'dendro', gauge);
}

export function inflictGauge(ctx, action) {
  const { element, gauge } = action.damage ?? {};
  if (!element || !gauge) return;

  switch (element) {
    case 'pyro':
      applyPyro(ctx, gauge, action.ownerId);
      break;

    case 'electro':
      applyElectro(ctx, gauge, action.ownerId);
      break;

    case 'cryo':
      applyCryo(ctx, gauge, action.ownerId);
      break;

    case 'hydro':
      applyHydro(ctx, gauge, action.ownerId);
      break;

    case 'anemo':
      applyAnemo(ctx, gauge, action.ownerId);
      break;

    case 'geo':
      applyGeo(ctx, gauge, action.ownerId);
      break;

    case 'dendro':
      applyDendro(ctx, gauge, action.ownerId);
      break;
  }
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
