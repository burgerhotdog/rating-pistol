import { consumeAura, updateShielded } from '../../states';

const mockAction = {
  shield: {
    duration: 15000,
  },
};

export function reactCrystallize(ctx, ownerId, auraElement, gaugeUnits) {
  const auraState = ctx.states.aura;
  const units = gaugeUnits / 2;

  let excess = units;

  if (!ctx.states.globalCooldowns.crystallize) {
    ctx.states.globalCooldowns.crystallize = 1000;

    if (auraElement === 'pyro') {
      excess = Math.min(
        consumeAura(auraState, 'burning', units),
        consumeAura(auraState, 'pyro', units),
      );
    } else {
      excess = consumeAura(auraState, auraElement, units);
    }

    ctx.runEffects('reaction', {
      reaction: 'crystallize',
      elements: ['geo', auraElement],
      ownerId,
    });

    updateShielded(ctx, mockAction);
  }

  return excess * 2;
}
