import { applyCryo } from '../../../reactions';
import { buildElevationSnapshot } from '../../../snapshot';
import { hasGameRule } from '../../gameRules';

function tickStellarSwirl(ctx, state, offset) {
  if (ctx.saveSnapshots) {
    const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
      multiplier: state.vortexHits >= 2 ? 3 : 2,
      element: 'cryo',
    });
    const runtime = snapshot.runtime + offset;

    ctx.snapshots.push({ ...snapshot, runtime });
  }

  state.vortexTimer = Infinity;
  state.vortexHits = 0;
  state.ownerId = null;
  if (hasGameRule(ctx, 'wanderingVortex')) {
    state.wanderingVortex = 6000;
  }

  applyCryo(ctx, 1, state.ownerId);
}

export function advanceStellarSwirl(ctx, elapsed) {
  const auraStore = ctx.states.aura;
  let remaining = elapsed;

  while (auraStore.stellarSwirl && remaining > 0) {
    const state = auraStore.stellarSwirl;
    const decrease = Math.min(state.timeLeft, state.vortexTimer, remaining);

    remaining -= decrease;
    state.timeLeft -= decrease;
    state.vortexTimer -= decrease;
    state.wanderingVortex = Math.max(state.wanderingVortex - decrease, 0);
    if (state.timeLeft === 0) {
      delete auraStore.stellarSwirl;
      break;
    }

    if (auraStore.stellarSwirl?.vortexTimer === 0) {
      tickStellarSwirl(ctx, auraStore.stellarSwirl, elapsed - remaining);
    }
  }
}
