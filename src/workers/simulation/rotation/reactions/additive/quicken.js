import { consumeAura } from '../../states';

export function reactQuicken(ctx, ownerId, auraElement, gaugeUnits) {
  const store = ctx.states.aura;
  const prevQuickenGauge = store.quicken?.gauge ?? 0;

  const auraGauge = store[auraElement].gauge;
  const quickenGauge = Math.min(auraGauge, gaugeUnits);

  if (quickenGauge > prevQuickenGauge) {
    const quickenDuration = (quickenGauge * 5 + 6) * 1000;
    const decayRate = quickenGauge / quickenDuration;

    store.quicken = {
      reaction: 'quicken',
      gauge: quickenGauge,
      decayRate,
    };
  }

  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'quicken',
    elements: ['dendro', 'electro'],
    ownerId,
  });

  return excessGaugeUnits;
}
