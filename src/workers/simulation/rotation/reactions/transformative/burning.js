import { applyAura } from '../../states';

export function reactBurning(ctx, applier, gaugeElement, gaugeUnits) {
  ctx.states.aura.burning ??= {
    reaction: 'burning',
    gauge: 2,
    timer: 250,
    ownerId: applier,
  };

  applyAura(ctx, gaugeElement, gaugeUnits);

  ctx.runEffects('reaction', {
    reaction: 'burning',
    elements: ['pyro', 'dendro'],
    ownerId: applier,
  });

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
