import { consumeAura } from '../../states';

export function reactFrozen(ctx, ownerId, auraElement, gaugeUnits) {
  const auraGauge = ctx.states.aura[auraElement].gauge;
  const frozenGauge = 2 * Math.min(auraGauge, gaugeUnits);
  const frozenDuration = (2 * Math.sqrt(5 * frozenGauge + 4) - 4) * 1000;

  ctx.states.aura.frozen = {
    reaction: 'frozen',
    gauge: frozenGauge,
    timeLeft: frozenDuration,
  };

  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'frozen',
    elements: ['cryo', 'hydro'],
    ownerId,
  });

  return excessGaugeUnits;
}
