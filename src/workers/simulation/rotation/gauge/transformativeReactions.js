import { consumeAura } from '../states/aura';
import { updateShielded } from '../states/shielded';
import { buildTransformativeReactionSnapshot } from '../snapshot';

export function reactOverloaded(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'overloaded', 'pyro');
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffects('reaction', {
    reaction: 'overloaded',
    elements: ['pyro', 'electro'],
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
    reaction: 'superconduct',
    elements: ['cryo', 'electro'],
    ownerId,
  });
}

export function reactSwirl(ctx, ownerId, auraElement) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'swirl', auraElement);
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffects('reaction', {
    reaction: 'swirl',
    elements: ['anemo', auraElement],
    ownerId,
  });
}

export function reactCrystallize(ctx, ownerId, auraElement) {
  ctx.runEffects('reaction', {
    reaction: 'crystallize',
    elements: ['geo', auraElement],
    ownerId,
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
    reaction: 'frozen',
    elements: ['cryo', 'hydro'],
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
    reaction: 'electroCharged',
    elements: ['electro', 'hydro'],
    ownerId: applier,
  });
}

export function reactBloom(ctx, applier) {
  const newCore = { timeLeft: 6000, ownerId: applier };

  const state = ctx.states.aura.bloom ??= {
    reaction: 'bloom',
    cores: [],
  };

  state.cores.push(newCore);

  if (state.cores.length > 5) {
    const oldestCore = state.cores.shift();

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, oldestCore.ownerId, 'bloom', 'dendro');
      ctx.snapshots.push(snapshot);
    }
  }

  ctx.runEffects('reaction', {
    reaction: 'bloom',
    elements: ['dendro', 'hydro'],
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
