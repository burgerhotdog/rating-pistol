import { applyCryo } from '../applyGauge';
import { buildElevationSnapshot } from '../../snapshot';
import { consumeAura, decayBuffUses } from '../../states';

const stellarSwirlReaction = {
  reaction: 'stellarSwirl',
  elements: ['cryo', 'anemo'],
};

const stellarSwirlCryoAction = {
  damage: {
    type: 'stellarSwirl',
    element: 'cryo',
  },
};

const stellarSwirlAnemoAction = {
  damage: {
    type: 'stellarSwirl',
    element: 'anemo',
  },
};

export function reactStellarSwirl(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const hasWV = ctx.hasRule('wanderingVortex');

  const state = auraStore.stellarSwirl ??= {
    reaction: 'stellarSwirl',
    timeLeft: hasWV ? 12000 : 8000,
    vortexTimer: Infinity,
    vortexHits: 0,
    ownerId: null,
    wanderingVortex: 0,
  };

  if (ctx.saveSnapshots) {
    const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
      multiplier: 0.75,
      element: 'anemo',
    });
    ctx.snapshots.push(snapshot);
  }
  decayBuffUses(ctx, stellarSwirlAnemoAction, ctx.cache.memberIds);

  const units = gaugeUnits / 2;
  const excess = consumeAura(auraStore, auraKey, units);

  state.timeLeft = hasWV ? 12000 : 8000;
  if (state.vortexTimer === Infinity) {
    state.vortexTimer = 3000;
    if (hasWV) {
      state.wanderingVortex = 6000;
    }
    state.ownerId = ownerId;
  } else {
    state.vortexHits++;
  }

  let detonated;
  const vortexOwner = state.ownerId;

  if (state.vortexHits >= 5) {
    detonated = true;

    if (ctx.saveSnapshots) {
      const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
        multiplier: 3,
        element: 'cryo',
      });
      ctx.snapshots.push(snapshot);
    }
    decayBuffUses(ctx, stellarSwirlCryoAction, ctx.cache.memberIds);

    state.vortexTimer = Infinity;
    state.vortexHits = 0;
    state.ownerId = null;
    if (hasWV) {
      state.wanderingVortex = 6000;
    }
  }

  ctx.runEffects('reaction', { ownerId, reaction: stellarSwirlReaction });
  ctx.runEffects('hit', { action: stellarSwirlAnemoAction });

  if (detonated) {
    applyCryo(ctx, 1, vortexOwner, stellarSwirlCryoAction);
    ctx.runEffects('hit', { action: stellarSwirlCryoAction });
  }

  return excess * 2;
}
