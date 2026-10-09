import { CHARACTER, GI } from '@/data';
import { applyAura, consumeAura, tryIcd } from '../states';
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
  reactShattered,
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

export function applyPyro(ctx, gauge, applier, action) {
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

  if (aura.hydro && availableUnits && !aura.frozen) {
    const { excess, mult } = reactVaporize(ctx, applier, false, availableUnits, action);
    availableUnits = excess;
    scaleMult = mult;
  }

  if (aura.cryo && availableUnits) {
    const { excess, mult } = reactMelt(ctx, applier, true, availableUnits, action);
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

function applyElectro(ctx, gauge, applier, action) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.stellarConduct) {
    aura.stellarConduct.hits++;
  }

  if (aura.bloom) {
    reactHyperbloom(ctx, applier);
  }

  if (aura.quicken) {
    scaleFlat = reactAggravate(ctx, applier, action);
  }

  if ((aura.pyro || aura.burning) && availableUnits) {
    availableUnits = reactOverloaded(ctx, applier, 'pyro', availableUnits);
  }

  if (aura.hydro && availableUnits && !aura.frozen) {
    if (ctx.cache.lunarCharged) {
      reactLunarCharged(ctx, applier);
    } else {
      reactElectroCharged(ctx, applier);
    }
  }

  if (aura.cryo && availableUnits) {
    if (ctx.cache.stellarConduct) {
      availableUnits = reactStellarConduct(ctx, applier, 'cryo', availableUnits);
    } else {
      availableUnits = reactSuperconduct(ctx, applier, 'cryo', availableUnits);
    }

    if (aura.frozen && availableUnits) {
      consumeAura(ctx, 'frozen', availableUnits);
    }
  }

  if (aura.dendro && availableUnits) {
    availableUnits = reactQuicken(ctx, applier, 'dendro', availableUnits);
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'electro', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

function applyHydro(ctx, gauge, applier, action) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if ((aura.pyro || aura.burning) && availableUnits) {
    const { excess, mult } = reactVaporize(ctx, applier, true, availableUnits, action);

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

function applyDendro(ctx, gauge, applier, action) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.quicken) {
    scaleFlat = reactSpread(ctx, applier, action);
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

function applyAnemo(ctx, gauge, applier, action) {
  const { aura } = ctx.states;
  let availableUnits = gauge;

  if (aura.electro && availableUnits) {
    availableUnits = reactSwirl(ctx, applier, 'electro', availableUnits);
  }

  if ((aura.pyro || aura.burning) && availableUnits) {
    availableUnits = reactSwirl(ctx, applier, 'pyro', availableUnits);
  }

  if (aura.hydro && availableUnits) {
    availableUnits = reactSwirl(ctx, applier, 'hydro', availableUnits);

    if (aura.frozen && availableUnits) {
      if (ctx.cache.stellarSwirl) {
        availableUnits = reactStellarSwirl(ctx, applier, 'frozen', availableUnits);
      } else {
        availableUnits = reactSwirl(ctx, applier, 'frozen', availableUnits);
      }
    }
  }

  if (aura.cryo && availableUnits) {
    if (ctx.cache.stellarSwirl) {
      availableUnits = reactStellarSwirl(ctx, applier, 'cryo', availableUnits);
    } else {
      availableUnits = reactSwirl(ctx, applier, 'cryo', availableUnits);
    }

    if (aura.frozen && availableUnits) {
      consumeAura(ctx, 'frozen', availableUnits);
    }
  }
}

function applyGeo(ctx, gauge, applier, action) {
  const { aura } = ctx.states;
  let availableUnits = gauge;

  if (aura.electro && availableUnits) {
    availableUnits = reactCrystallize(ctx, applier, 'electro', availableUnits);
  }

  if ((aura.pyro || aura.burning) && availableUnits) {
    availableUnits = reactCrystallize(ctx, applier, 'pyro', availableUnits);
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

export function applyCryo(ctx, gauge, applier, action) {
  const { aura } = ctx.states;
  let availableUnits = gauge;
  let scaleMult;
  let scaleFlat;

  if (aura.stellarConduct) {
    aura.stellarConduct.hits++;
  }

  if (aura.electro && availableUnits) {
    if (ctx.cache.stellarConduct) {
      availableUnits = reactStellarConduct(ctx, applier, 'electro', availableUnits);
    } else {
      availableUnits = reactSuperconduct(ctx, applier, 'electro', availableUnits);
    }
  }

  if ((aura.pyro || aura.burning) && availableUnits) {
    const { excess, mult } = reactMelt(ctx, applier, false, availableUnits, action);
    availableUnits = excess;
    scaleMult = mult;
  }

  if (aura.hydro && availableUnits) {
    availableUnits = reactFrozen(ctx, applier, 'hydro', availableUnits);
  }

  if (availableUnits === gauge) {
    applyAura(ctx, 'cryo', availableUnits);
  }

  return { scaleMult, scaleFlat };
}

const isBluntAttack = (action) => {
  if (!action.damage) return;

  const ownerId = action.ownerId;
  const ownerType = CHARACTER[GI][ownerId].type;
  const actionRef = action.ref;
  const actionType = action.type;
  const damageType = action.damage.type;
  const damageElem = action.damage.element;

  const isClaymore = ownerType === 'claymore';
  const isKinichMidair = ownerId === 10000101 && actionRef === 'normalAttack.2';
  if (isClaymore && !isKinichMidair) return true;

  const isPlunge = actionType === 'plungingAttack';
  const isSwordClaymorePolearm = ownerType === 'sword' || ownerType === 'claymore' || ownerType === 'polearm';
  const isVaresa = ownerId === 10000111;
  if ((isPlunge && isSwordClaymorePolearm) || isVaresa) return true;

  const isGeo = damageElem === 'geo';
  const isGeoException =
    (ownerId === 10000027 && damageType === 'plungingAttack') ||
    (ownerId === 10000103 && actionRef === 'elementalSkill.0');
  if (isGeo && !isGeoException) return true;
};

const directRxnTypes = new Set([
  'lunarCharged',
  'lunarBloom',
  'lunarCrystallize',
  'stellarConduct',
  'stellarSwirl',
]);

export function applyGauge(ctx, action) {
  const { ownerId, damage = {} } = action;
  const { type, element, gauge, icd } = damage;
  const auraStore = ctx.states.aura;

  if (auraStore.frozen && isBluntAttack(action)) {
    reactShattered(ctx, ownerId);
  }

  if (directRxnTypes.has(type) || element === 'physical' || !gauge) return;
  if (!tryIcd(ctx, ownerId, icd)) return;

  switch (element) {
    case 'pyro':
      return applyPyro(ctx, gauge, ownerId, action);

    case 'electro':
      return applyElectro(ctx, gauge, ownerId, action);

    case 'cryo':
      return applyCryo(ctx, gauge, ownerId, action);

    case 'hydro':
      return applyHydro(ctx, gauge, ownerId, action);

    case 'anemo':
      return applyAnemo(ctx, gauge, ownerId, action);

    case 'geo':
      return applyGeo(ctx, gauge, ownerId, action);

    case 'dendro':
      return applyDendro(ctx, gauge, ownerId, action);
  }
}
