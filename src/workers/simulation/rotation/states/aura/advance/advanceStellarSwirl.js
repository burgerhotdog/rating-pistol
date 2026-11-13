import { applyCryo } from '../../../reactions';
import { buildElevationSnapshot } from '../../../snapshot';
import { decayBuffUses } from '../../effects';

const stellarSwirlCryoAction = {
  damage: {
    type: 'stellarSwirl',
    element: 'cryo',
  },
};

function tickStellarSwirl(ctx, state) {
  if (ctx.saveSnapshots) {
    const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
      multiplier: state.vortexHits >= 2 ? 3 : 2,
      element: 'cryo',
    });
    ctx.snapshots.push(snapshot);
  }
  decayBuffUses(ctx, stellarSwirlCryoAction, ctx.cache.memberIds);

  const vortexOwner = state.ownerId;

  state.vortexTimer = Infinity;
  state.vortexHits = 0;
  state.ownerId = null;
  if (ctx.hasRule('wanderingVortex')) {
    state.wanderingVortex = 6000;
  }

  applyCryo(ctx, 1, vortexOwner);
  ctx.runEffects('hit', { action: stellarSwirlCryoAction });
}

export function advanceStellarSwirlTimers(ctx, step) {
  const auraStore = ctx.states.aura;
  const state = auraStore.stellarSwirl;
  if (!state) return;

  state.timeLeft -= step;
  state.vortexTimer -= step;
  state.wanderingVortex = Math.max(state.wanderingVortex - step, 0);

  if (state.timeLeft <= 0) {
    delete auraStore.stellarSwirl;
  }
}

export function fireStellarSwirl(ctx) {
  const state = ctx.states.aura.stellarSwirl;

  if (state?.vortexTimer <= 0) {
    tickStellarSwirl(ctx, state);
  }
}
