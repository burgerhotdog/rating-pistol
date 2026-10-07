import { consumeAura } from '../../states';

export function reactStellarConduct(ctx, ownerId, auraElement, gaugeUnits) {
  const state = ctx.states.aura.stellarConduct ??= {
    reaction: 'stellarConduct',
    prevHits: 0,
    multiplier: 1,
    bonus: 0.2,
    hits: 0,
    timer: 4000,
  };

  state.timeLeft = 7000;

  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'stellarConduct',
    elements: ['cryo', 'electro'],
    ownerId,
  });

  return excessGaugeUnits;
}
