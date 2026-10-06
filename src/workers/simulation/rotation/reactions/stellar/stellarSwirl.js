import { applyCryo } from '../applyGauge';
import { buildElevationSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactStellarSwirl(ctx, ownerId, gaugeUnits) {
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
    reaction: 'stellarSwirl',
    elements: ['cryo', 'anemo'],
    ownerId,
  });

  consumeAura(ctx, 'cryo', gaugeUnits);
}
