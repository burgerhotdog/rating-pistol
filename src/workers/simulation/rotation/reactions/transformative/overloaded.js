import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

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

  if (!ctx.states.globalCooldowns.overloaded) {
    ctx.states.globalCooldowns.overloaded = 500;

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'overloaded', 'pyro');
      ctx.snapshots.push(snapshot);
    }
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
  ctx.runEffects('hit', { action: overloadedAction });

  return excess;
}
