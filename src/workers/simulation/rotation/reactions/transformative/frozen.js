import { consumeAura } from '../../states';

const frozenReaction = {
  reaction: 'frozen',
  elements: ['cryo', 'hydro'],
};

export function reactFrozen(ctx, ownerId, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const auraGauge = auraStore[auraElement].gauge;
  const frozenGauge = 2 * Math.min(auraGauge, gaugeUnits);
  const frozenDuration = (2 * Math.sqrt(5 * frozenGauge + 4) - 4) * 1000;

  auraStore.frozen = {
    reaction: 'frozen',
    gauge: frozenGauge,
    timeLeft: frozenDuration,
  };

  const excess = consumeAura(auraStore, auraElement, gaugeUnits);

  ctx.runEffects('reaction', { ownerId, reaction: frozenReaction });

  return excess;
}
