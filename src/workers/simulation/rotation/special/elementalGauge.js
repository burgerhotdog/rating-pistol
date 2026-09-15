import {
  reactOverloaded,
  reactSuperconduct,
} from './transformativeReactions';
import { attemptApplyElement } from './icd';

function applyAura(ctx, element, gauge) {
  const aura = ctx.states.aura[element] ??= { element };

  aura.decayRate ??= ((35 / (4 * gauge)) + (25 / 8)) * 1000;
  aura.gauge = Math.max(aura.gauge ?? 0, gauge * 0.8);
}

function applyPyro(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.electro) {
    reactOverloaded(ctx, aura.electro, gauge, applier);
    return;
  }

  applyAura(ctx, 'pyro', gauge);
}

function applyElectro(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.pyro) {
    reactOverloaded(ctx, aura.pyro, gauge, applier);
    return;
  }

  if (aura.cryo) {
    reactSuperconduct(ctx, aura.cryo, gauge);
    return;
  }

  applyAura(ctx, 'electro', gauge);
}

function applyCryo(ctx, gauge, applier) {
  const { aura } = ctx.states;

  if (aura.electro) {
    reactSuperconduct(ctx, aura.electro, gauge);
    return;
  }

  applyAura(ctx, 'cryo', gauge);
}

function applyHydro(ctx, gauge, applier) {
  applyAura(ctx, 'hydro', gauge);
}

function applyAnemo(ctx, gauge, applier) {
}

function applyGeo(ctx, gauge, applier) {
}

function applyDendro(ctx, gauge, applier) {
  applyAura(ctx, 'dendro', gauge);
}

export function applyGauge(ctx, action) {
  const { element, gauge, icd } = action.damage ?? {};
  if (element === 'physical' || !gauge) return;

  if (icd) {
    const attemptSuccess = attemptApplyElement(ctx, action.ownerId, icd);
    if (!attemptSuccess) return;
  }

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
