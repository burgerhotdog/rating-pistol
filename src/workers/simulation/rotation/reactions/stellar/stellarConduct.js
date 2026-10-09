import { consumeAura } from '../../states';

export function reactStellarConduct(ctx, ownerId, auraKey, gaugeUnits) {
  const auraStore = ctx.states.aura;

  const state = auraStore.stellarConduct ??= {
    reaction: 'stellarConduct',
    multiplier: 1,
    bonus: 0.2,
    hits: 0,
    timer: 4000,
  };

  state.timeLeft = 7000;

  const excess = consumeAura(auraStore, auraKey, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'stellarConduct',
    elements: ['cryo', 'electro'],
    ownerId,
  });

  return excess;
}
