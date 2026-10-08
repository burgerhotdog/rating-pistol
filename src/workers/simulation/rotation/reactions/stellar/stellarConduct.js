import { consumeAura } from '../../states';

export function reactStellarConduct(ctx, ownerId, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const state = auraStore.stellarConduct ??= {
    reaction: 'stellarConduct',
    multiplier: 1,
    bonus: 0.2,
    hits: 0,
    timer: 4000,
  };

  state.timeLeft = 7000;

  const excessGaugeUnits = consumeAura(auraStore, auraElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'stellarConduct',
    elements: ['cryo', 'electro'],
    ownerId,
  });

  return excessGaugeUnits;
}
