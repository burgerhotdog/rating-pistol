import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactSuperconduct(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;

  if (ctx.states.globalCooldowns.superconduct?.length !== 2) {
    (ctx.states.globalCooldowns.superconduct ??= []).push(500);

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'superconduct', 'cryo');
      ctx.snapshots.push(snapshot);
    }
  }

  const state = auraStore.superconduct ??= {
    reaction: 'superconduct',
  };

  state.timeLeft = 12000;

  const excess = consumeAura(auraStore, auraKey, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'superconduct',
    elements: ['cryo', 'electro'],
    ownerId,
  });

  return excess;
}
