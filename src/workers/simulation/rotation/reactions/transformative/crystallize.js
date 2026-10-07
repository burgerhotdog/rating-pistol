import { consumeAura, updateShielded } from '../../states';

const mockAction = {
  shield: {
    duration: 15000,
  },
};

export function reactCrystallize(ctx, ownerId, auraElement, gaugeUnits) {
  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, gaugeUnits / 2);

  ctx.runEffects('reaction', {
    reaction: 'crystallize',
    elements: ['geo', auraElement],
    ownerId,
  });

  updateShielded(ctx, mockAction);

  return excessGaugeUnits;
}
