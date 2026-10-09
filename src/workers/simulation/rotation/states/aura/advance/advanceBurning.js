import { applyPyro } from '../../../reactions';
import { buildTransformativeReactionSnapshot } from '../../../snapshot';
import { consumeAura } from '../consumeAura';
import { decayElementalAura } from './decayElementalAura';

function decayDendroAura(auraStore, elapsed) {
  const state = auraStore.dendro;
  const specialDecayRate = Math.max(0.0004, 2 * state.decayRate);

  consumeAura(auraStore, 'dendro', elapsed * specialDecayRate);
  return !auraStore.dendro;
}

function tickBurning(ctx, burningState, offset = 0) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, burningState.ownerId, 'burning', 'pyro');
    const runtime = snapshot.runtime + offset;

    ctx.snapshots.push({ ...snapshot, runtime });
  }

  burningState.timer = 250;

  if (!ctx.states.globalCooldowns.burning) {
    ctx.states.globalCooldowns.burning = 2000;
    applyPyro(ctx, 1, burningState.ownerId);
  }
}

export function advanceBurning(ctx, elapsed) {
  const auraStore = ctx.states.aura;
  let remaining = elapsed;

  while (auraStore.burning && remaining > 0) {
    const decrease = Math.min(auraStore.burning.timer, remaining);

    auraStore.burning.timer -= decrease;
    remaining -= decrease;
    decayElementalAura(auraStore, 'pyro', decrease);
    decayDendroAura(auraStore, decrease);

    if (auraStore.burning?.timer === 0) {
      tickBurning(ctx, auraStore.burning, elapsed - remaining);
    }
  }

  if (remaining > 0) {
    decayElementalAura(auraStore, 'pyro', remaining);
    decayElementalAura(auraStore, 'dendro', remaining);
  }
}
