import { applyCryo } from '../applyGauge';
import { buildElevationSnapshot } from '../../snapshot';
import { consumeAura, hasGameRule } from '../../states';

export function reactStellarSwirl(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const hasWV = hasGameRule(ctx, 'wanderingVortex');

  const state = auraStore.stellarSwirl ??= {
    reaction: 'stellarSwirl',
    timeLeft: hasWV ? 12000 : 8000,
    vortexTimer: Infinity,
    vortexHits: 0,
    ownerId: null,
    wanderingVortex: 0,
  };

  state.timeLeft = hasWV ? 12000 : 8000;

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
    if (hasWV) {
      state.wanderingVortex = 6000;
    }
  }

  const units = gaugeUnits / 2;
  const excess = consumeAura(auraStore, auraKey, units);

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
    if (hasWV) {
      state.wanderingVortex = 6000;
    }

    applyCryo(ctx, 1, ownerId);
  }

  return excess * 2;
}
