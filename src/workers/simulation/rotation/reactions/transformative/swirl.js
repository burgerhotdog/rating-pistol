import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactSwirl(ctx, ownerId, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'swirl', auraElement);
    ctx.snapshots.push(snapshot);
  }

  const units = gaugeUnits / 2;
  let excess;

  if (auraElement === 'pyro') {
    excess = Math.min(
      consumeAura(auraStore, 'burning', units),
      consumeAura(auraStore, 'pyro', units),
    );
  } else {
    excess = consumeAura(auraStore, auraElement, units);
  }

  ctx.runEffects('reaction', {
    reaction: 'swirl',
    elements: [auraElement, 'anemo'],
    ownerId,
  });

  return excess * 2;
}
