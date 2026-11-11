import { applyAura } from '../../states';

const burningReaction = {
  reaction: 'burning',
  elements: ['pyro', 'dendro'],
};

export function reactBurning(ctx, applier, gaugeElement, gaugeUnits) {
  ctx.states.aura.burning ??= {
    reaction: 'burning',
    gauge: 2,
    timer: 250,
    ownerId: applier,
  };

  applyAura(ctx, gaugeElement, gaugeUnits);

  ctx.runEffects('reaction', { ownerId: applier, reaction: burningReaction });

  return 0;
}

export function refreshBurning(ctx, applier, gaugeElement, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const burningState = auraStore.burning;

  burningState.ownerId = applier;

  if (gaugeElement === 'dendro') {
    auraStore.dendro.gauge = gaugeUnits;
  } else {
    applyAura(ctx, 'pyro', gaugeUnits);
  }

  return 0;
}
