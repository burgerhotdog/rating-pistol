import { consumeAura } from '../states/aura';
import { updateShielded } from '../states/shielded';
import { buildTransformativeReactionSnapshot } from '../snapshot';

const REACTION_DEFS = {
  overloaded: {
    reaction: 'overloaded',
    elements: ['pyro', 'electro'],
  },
  superconduct: {
    reaction: 'superconduct',
    elements: ['cryo', 'electro'],
  },
  swirl: {
    reaction: 'swirl',
    elements: ['anemo'],
  },
  crystallize: {
    reaction: 'crystallize',
    elements: ['geo'],
  },
  frozen: {
    reaction: 'frozen',
    elements: ['cryo', 'hydro'],
  },
  electroCharged: {
    reaction: 'electroCharged',
    elements: ['electro', 'hydro'],
  },
};

export function reactOverloaded(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'overloaded', 'pyro');
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.overloaded,
    ownerId,
  });
}

export function reactSuperconduct(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'superconduct', 'cryo');
    ctx.snapshots.push(snapshot);
  }

  const state = ctx.states.aura.superconduct ??= {
    reaction: 'superconduct',
  };

  state.timeLeft = 12000;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.superconduct,
    ownerId,
  });
}

export function reactSwirl(ctx, ownerId, auraElement) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'swirl', auraElement);
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.swirl,
    ownerId,
    elements: ['anemo', auraElement],
  });
}

export function reactCrystallize(ctx, ownerId, auraElement) {
  ctx.runEffects('reaction', {
    ...REACTION_DEFS.crystallize,
    ownerId,
    elements: ['geo', auraElement],
  });

  updateShielded(ctx, { shield: { duration: 15000 } });
}

export function reactFrozen(ctx, ownerId, originGauge, gauge) {
  const frozenAuraGauge = 2 * Math.min(originGauge, gauge);
  const freezeDuration = (2 * Math.sqrt(5 * frozenAuraGauge + 4) - 4) * 1000;

  ctx.states.aura.frozen = {
    reaction: 'frozen',
    timeLeft: freezeDuration,
  };

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.frozen,
    ownerId,
  });
}

export function reactElectroCharged(ctx, applier) {
  const state = ctx.states.aura.electroCharged ??= {
    reaction: 'electroCharged',
    timeLeft: 0,
  };

  state.applier = applier;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.electroCharged,
    ownerId: applier,
  });
}

export function tickElectroCharged(ctx, applier, offset = 0) {
  const { aura } = ctx.states;

  if (!aura.electro || !aura.hydro) {
    delete aura.electroCharged;
    return true;
  }

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'electroCharged', 'electro');
    ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + offset });
  }

  consumeAura(ctx, aura.electro, 0.4);
  consumeAura(ctx, aura.hydro, 0.4);

  if (!aura.electro || !aura.hydro) {
    delete aura.electroCharged;
    return true;
  }

  aura.electroCharged.timeLeft = 1000;
  return false;
}
