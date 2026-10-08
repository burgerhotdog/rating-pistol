import { applyCryo } from '../applyGauge';
import { buildElevationSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactStellarSwirl(ctx, ownerId, gaugeUnits) {
  const state = ctx.states.aura.stellarSwirl ??= {
    reaction: 'stellarSwirl',
    timeLeft: 8000,
    vortexTimer: Infinity,
    vortexHits: 0,
    ownerId: null,
  };

  state.timeLeft = 8000;

  if (state.vortexTimer !== Infinity) {
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
    state.ownerId = ownerId;
  }

  consumeAura(ctx.states.aura, 'cryo', gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'stellarSwirl',
    elements: ['cryo', 'anemo'],
    ownerId,
  });

  if (state.vortexHits === 5) {
    if (ctx.saveSnapshots) {
      const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
        multiplier: 3,
        element: 'cryo',
      });

      ctx.snapshots.push(snapshot);
    }

    state.vortexTimer = Infinity;
    state.vortexHits = 0;
    state.ownerId = null;

    applyCryo(ctx, 1, ownerId);
  }
}
