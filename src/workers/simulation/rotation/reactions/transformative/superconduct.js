import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura, decayBuffUses } from '../../states';

const superconductAction = {
  damage: {
    type: 'superconduct',
    element: 'cryo',
  },
};

const superconductReaction = {
  reaction: 'superconduct',
  elements: ['cryo', 'electro'],
};

export function reactSuperconduct(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;

  let wasHit;

  if (ctx.states.globalCooldowns.superconduct?.length !== 2) {
    (ctx.states.globalCooldowns.superconduct ??= []).push(500);

    wasHit = true;

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'superconduct', 'cryo');
      ctx.snapshots.push(snapshot);
    }

    decayBuffUses(ctx, superconductAction, [ownerId]);
  }

  const state = auraStore.superconduct ??= {
    reaction: 'superconduct',
  };

  state.timeLeft = 12000;

  const excess = consumeAura(auraStore, auraKey, gaugeUnits);

  ctx.runEffects('reaction', { ownerId, reaction: superconductReaction });

  if (wasHit) {
    ctx.runEffects('hit', { action: superconductAction });
  }

  return excess;
}
