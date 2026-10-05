import { applyCryo } from './applyGauge';
import { buildElevationSnapshot } from '../snapshot';

const REACTION_DEFS = {
  stellarConduct: {
    reaction: 'stellarConduct',
    elements: ['cryo', 'electro'],
  },
  stellarSwirl: {
    reaction: 'stellarSwirl',
    elements: ['cryo', 'anemo'],
  },
};

export function reactStellarConduct(ctx, ownerId) {
  const state = ctx.states.aura.stellarConduct ??= {
    reaction: 'stellarConduct',
    prevHits: 0,
    multiplier: 1,
    bonus: 0.2,
    hits: 0,
    timer: 4000,
  };

  state.timeLeft = 7000;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.stellarConduct,
    ownerId,
  });
}

export function reactStellarSwirl(ctx, ownerId) {
  const state = ctx.states.aura.stellarSwirl ??= {
    reaction: 'stellarSwirl',
  };

  state.timeLeft = 8000;

  if (state.vortexTimer) {
    state.vortexHits++;
    state.ownerId = ownerId;
  } else {
    if (ctx.saveSnapshots) {
      const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
        multiplier: 0.75,
        element: 'anemo',
      });

      ctx.snapshots.push(snapshot);
    }

    state.vortexTimer = 3000;
    state.vortexHits = 0;
    state.ownerId = ownerId;
  }

  if (state.vortexHits === 5) {
    if (ctx.saveSnapshots) {
      const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
        multiplier: 3,
        element: 'cryo',
      });

      ctx.snapshots.push(snapshot);
    }

    applyCryo(ctx, 1, ownerId);

    state.vortexTimer = null;
    state.vortexHits = null;
    state.ownerId = null;
  }

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.stellarSwirl,
    ownerId,
  });
}
