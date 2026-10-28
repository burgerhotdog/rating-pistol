import { applyCryo } from '../../../reactions';
import { buildElevationSnapshot } from '../../../snapshot';
import { hasGameRule } from '../../gameRules';

function tickStellarSwirl(ctx, state) {
  if (ctx.saveSnapshots) {
    ctx.snapshots.push(
      buildElevationSnapshot(ctx, 'stellarSwirl', {
        multiplier: state.vortexHits >= 2 ? 3 : 2,
        element: 'cryo',
      })
    );
  }

  state.vortexTimer = Infinity;
  state.vortexHits = 0;
  state.ownerId = null;
  if (hasGameRule(ctx, 'wanderingVortex')) {
    state.wanderingVortex = 6000;
  }

  applyCryo(ctx, 1, state.ownerId);

  ctx.runEffects('hit', {
    damage: {
      type: 'stellarSwirl',
      element: 'cryo',
    },
  });
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
