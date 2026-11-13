import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura, decayBuffUses } from '../../states';

const overloadedAction = {
  damage: {
    type: 'overloaded',
    element: 'pyro',
  },
};

const overloadedReaction = {
  reaction: 'overloaded',
  elements: ['pyro', 'electro'],
};

export function reactOverloaded(ctx, ownerId, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;

  let wasHit;

  if (!ctx.states.globalCooldowns.overloaded) {
    ctx.states.globalCooldowns.overloaded = 500;

    wasHit = true;

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'overloaded', 'pyro');
      ctx.snapshots.push(snapshot);
    }

    decayBuffUses(ctx, overloadedAction, [ownerId]);
  }

  let excess;

  if (auraElement === 'pyro') {
    excess = Math.min(
      consumeAura(auraStore, 'burning', gaugeUnits),
      consumeAura(auraStore, 'pyro', gaugeUnits),
    );
  } else {
    excess = consumeAura(auraStore, 'electro', gaugeUnits);
  }

  ctx.runEffects('reaction', { ownerId, reaction: overloadedReaction });

  if (wasHit) {
    ctx.runEffects('hit', { action: overloadedAction });
  }

  return excess;
}
