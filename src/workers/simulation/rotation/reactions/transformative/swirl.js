import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactSwirl(ctx, ownerId, auraElement, gaugeUnits) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'swirl', auraElement);
    ctx.snapshots.push(snapshot);
  }

  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, gaugeUnits / 2);

  ctx.runEffects('reaction', {
    reaction: 'swirl',
    elements: [auraElement, 'anemo'],
    ownerId,
  });

  return excessGaugeUnits;
}
