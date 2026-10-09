import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactSwirl(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const auraElement = auraKey === 'frozen' ? 'cryo': 'auraKey';

  if (ctx.states.globalCooldowns.swirl?.length !== 2) {
    (ctx.states.globalCooldowns.swirl ??= []).push(500);

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'swirl', auraElement);
      ctx.snapshots.push(snapshot);
    }
  }

  const units = gaugeUnits / 2;
  let excess;

  if (auraKey === 'pyro') {
    excess = Math.min(
      consumeAura(auraStore, 'burning', units),
      consumeAura(auraStore, 'pyro', units),
    );
  } else {
    excess = consumeAura(auraStore, auraKey, units);
  }

  ctx.runEffects('reaction', {
    reaction: 'swirl',
    elements: [auraElement, 'anemo'],
    ownerId,
  });

  return excess * 2;
}
