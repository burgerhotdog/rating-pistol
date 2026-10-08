import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactOverloaded(ctx, ownerId, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'overloaded', 'pyro');
    ctx.snapshots.push(snapshot);
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

  ctx.runEffects('reaction', {
    reaction: 'overloaded',
    elements: ['pyro', 'electro'],
    ownerId,
  });

  return excess;
}
