import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactOverloaded(ctx, ownerId, auraElement, gaugeUnits) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'overloaded', 'pyro');
    ctx.snapshots.push(snapshot);
  }

  const excessGaugeUnits = consumeAura(ctx, auraElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'overloaded',
    elements: ['pyro', 'electro'],
    ownerId,
  });

  return excessGaugeUnits;
}
