import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura, decayBuffUses } from '../../states';

export function reactSwirl(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const auraElement = auraKey === 'frozen' ? 'cryo': auraKey;

  let wasHit;

  if (ctx.states.globalCooldowns.swirl?.length !== 2) {
    (ctx.states.globalCooldowns.swirl ??= []).push(500);

    wasHit = true;

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'swirl', auraElement);
      ctx.snapshots.push(snapshot);
    }

    decayBuffUses(ctx, {
      damage: {
        type: 'swirl',
        element: auraElement,
      },
    }, [ownerId]);
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

  ctx.runEffects('reaction', { ownerId, reaction: {
    reaction: 'swirl',
    elements: [auraElement, 'anemo'],
    ownerId,
  }});

  if (wasHit) {
    ctx.runEffects('hit', { action: {
      damage: {
        type: 'swirl',
        element: auraElement,
      },
    }});
  }

  return excess * 2;
}
