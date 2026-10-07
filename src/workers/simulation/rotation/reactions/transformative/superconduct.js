import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactSuperconduct(ctx, ownerId, auraElement, gaugeUnits) {
  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'superconduct', 'cryo');
    ctx.snapshots.push(snapshot);
  }

  const state = ctx.states.aura.superconduct ??= {
    reaction: 'superconduct',
  };

  state.timeLeft = 12000;

  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'superconduct',
    elements: ['cryo', 'electro'],
    ownerId,
  });

  return excessGaugeUnits;
}
