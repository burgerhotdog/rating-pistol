import { applyPyro } from '../../../reactions';
import { buildTransformativeReactionSnapshot } from '../../../snapshot';
import { decayBuffUses } from '../../effects';
import { consumeAura } from '../consumeAura';
import { decayElementalAura } from './decayElementalAura';

function decayDendroAura(auraStore, elapsed) {
  const state = auraStore.dendro;
  const specialDecayRate = Math.max(0.0004, 2 * state.decayRate);

  consumeAura(auraStore, 'dendro', elapsed * specialDecayRate);
  return !auraStore.dendro;
}

function tickBurning(ctx, burningState) {
  if (ctx.saveSnapshots) {
    ctx.snapshots.push(
      buildTransformativeReactionSnapshot(ctx, burningState.ownerId, 'burning', 'pyro')
    );
  }

  decayBuffUses(ctx, {
    damage: {
      type: 'burning',
      element: 'pyro',
    },
  }, [burningState.ownerId])

  burningState.timer = 250;

  if (!ctx.states.globalCooldowns.burning) {
    ctx.states.globalCooldowns.burning = 2000;
    applyPyro(ctx, 1, burningState.ownerId);
  }

  ctx.runEffects('hit', { action: {
    damage: {
      type: 'burning',
      element: 'pyro',
    },
  }});
}

export function advanceBurningTimers(ctx, step) {
  const auraStore = ctx.states.aura;
  if (!auraStore.burning) return;

  auraStore.burning.timer -= step;
  decayElementalAura(auraStore, 'pyro', step);
  decayDendroAura(auraStore, step);
}

export function fireBurning(ctx) {
  const burningState = ctx.states.aura.burning;

  if (burningState?.timer <= 0) {
    tickBurning(ctx, burningState);
  }
}
