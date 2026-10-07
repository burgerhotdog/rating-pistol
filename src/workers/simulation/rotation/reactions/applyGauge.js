import { applyAura, tryIcd } from '../states';
import {
  reactAggravate,
  reactQuicken,
  reactSpread,
} from './additive';
import {
  reactMelt,
  reactVaporize,
} from './amplifying';
import {
  reactBloom,
  reactBurgeon,
  reactBurning,
  refreshBurning,
  reactCrystallize,
  reactElectroCharged,
  reactFrozen,
  reactHyperbloom,
  reactOverloaded,
  reactSuperconduct,
  reactSwirl,
} from './transformative';
import {
  reactLunarBloom,
  reactLunarCharged,
  reactLunarCrystallize,
} from './lunar';
import {
  reactStellarConduct,
  reactStellarSwirl,
} from './stellar';

export function applyPyro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.bloom) {
    reactBurgeon(ctx, applier);
  }

  if (aura.electro && availableUnits) {
    availableUnits = reactOverloaded(ctx, applier, 'electro', availableUnits);
  }

  if (aura.hydro && availableUnits) {
    const { excess, mult } = reactVaporize(ctx, applier, 'hydro', availableUnits);
    availableUnits = excess;
    scaleMult = mult;
  }

  if (aura.cryo && availableUnits) {
    const { excess, mult } = reactMelt(ctx, applier, 'cryo', availableUnits);
    availableUnits = excess;
    scaleMult = mult;
  }

  if (aura.dendro && availableUnits) {
    if (!aura.burning) {
      availableUnits = reactBurning(ctx, applier, 'pyro', availableUnits);
    } else {
      availableUnits = refreshBurning(ctx, applier, 'pyro', availableUnits);
    }
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'pyro', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

function applyElectro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.bloom) {
    reactHyperbloom(ctx, applier);
  }

  if (aura.quicken) {
    scaleFlat = reactAggravate(ctx, applier);
  }

  if (aura.stellarConduct) {
    aura.stellarConduct.hits++;
  }

  if (aura.pyro && availableUnits) {
    availableUnits = reactOverloaded(ctx, applier, 'pyro', availableUnits);
  }

  if (aura.cryo && availableUnits) {
    if (ctx.cache.stellarConduct) {
      availableUnits = reactStellarConduct(ctx, applier, 'cryo', availableUnits);
    } else {
      availableUnits = reactSuperconduct(ctx, applier, 'cryo', availableUnits);
    }
  }

  if (aura.dendro && availableUnits) {
    availableUnits = reactQuicken(ctx, applier, 'dendro', availableUnits);
  }

  if (aura.hydro && availableUnits) {
    if (ctx.cache.lunarCharged) {
      reactLunarCharged(ctx, applier);
    } else {
      reactElectroCharged(ctx, applier);
    }
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'electro', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

function applyHydro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.pyro && availableUnits) {
    const { excess, mult } = reactVaporize(ctx, applier, 'pyro', availableUnits);
    availableUnits = excess;
    scaleMult = mult;
  }

  if (aura.cryo && availableUnits) {
    availableUnits = reactFrozen(ctx, applier, 'cryo', availableUnits);
  }

  if (aura.dendro && availableUnits) {
    if (ctx.cache.lunarBloom) {
      reactLunarBloom(ctx, applier);
    }

    availableUnits = reactBloom(ctx, applier, 'dendro', availableUnits);
  }

  if (aura.electro && availableUnits) {
    if (ctx.cache.lunarCharged) {
      reactLunarCharged(ctx, applier);
    } else {
      reactElectroCharged(ctx, applier);
    }
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'hydro', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

function applyDendro(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.quicken) {
    scaleFlat = reactSpread(ctx, applier);
  }

  if (aura.pyro && availableUnits) {
    if (!aura.burning) {
      availableUnits = reactBurning(ctx, applier, 'dendro', availableUnits);
    } else {
      availableUnits = refreshBurning(ctx, applier, 'dendro', availableUnits);
    }
  }

  if (aura.electro && availableUnits) {
    availableUnits = reactQuicken(ctx, applier, 'electro', availableUnits);
  }

  if (aura.hydro && availableUnits) {
    if (ctx.cache.lunarBloom) {
      reactLunarBloom(ctx, applier);
    }

    availableUnits = reactBloom(ctx, applier, 'hydro', availableUnits);
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'dendro', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

function applyAnemo(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;

  if (aura.pyro && availableUnits) {
    availableUnits = reactSwirl(ctx, applier, 'pyro', availableUnits);
  }

  if (aura.electro && availableUnits) {
    availableUnits = reactSwirl(ctx, applier, 'electro', availableUnits);
  }

  if (aura.hydro && availableUnits) {
    availableUnits = reactSwirl(ctx, applier, 'hydro', availableUnits);
  }

  if (aura.cryo && availableUnits) {
    if (ctx.cache.stellarSwirl) {
      reactStellarSwirl(ctx, applier, availableUnits);
    } else {
      reactSwirl(ctx, applier, 'cryo', availableUnits);
    }
  }
}

function applyGeo(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;

  if (aura.pyro && availableUnits) {
    availableUnits = reactCrystallize(ctx, applier, 'pyro', availableUnits);
  }

  if (aura.electro && availableUnits) {
    availableUnits = reactCrystallize(ctx, applier, 'electro', availableUnits);
  }

  if (aura.hydro && availableUnits) {
    if (ctx.cache.lunarCrystallize) {
      availableUnits = reactLunarCrystallize(ctx, applier);
    } else {
      availableUnits = reactCrystallize(ctx, applier, 'hydro', availableUnits);
    }
  }

  if (aura.cryo && availableUnits) {
    reactCrystallize(ctx, applier, 'cryo', availableUnits);
  }
}

export function applyCryo(ctx, gauge, applier) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.stellarConduct) {
    aura.stellarConduct.hits++;
  }

  if (aura.pyro && availableUnits) {
    const { excess, mult } = reactMelt(ctx, applier, 'pyro', availableUnits);
    availableUnits = excess;
    scaleMult = mult;
  }

  if (aura.electro && availableUnits) {
    if (ctx.cache.stellarConduct) {
      availableUnits = reactStellarConduct(ctx, applier, 'electro', availableUnits);
    } else {
      availableUnits = reactSuperconduct(ctx, applier, 'electro', availableUnits);
    }
  }

  if (aura.hydro && availableUnits) {
    availableUnits = reactFrozen(ctx, applier, 'hydro', availableUnits);
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'cryo', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

export function applyGauge(ctx, action) {
  const { ownerId, damage = {} } = action;
  const { element, gauge, icd } = damage;

  if (element === 'physical' || !gauge) return;
  if (!tryIcd(ctx, ownerId, icd)) return;

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
