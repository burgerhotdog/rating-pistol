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
  const store = ctx.states.aura;
  const state = store.burning;

  state.ownerId = applier;

  if (gaugeElement === 'dendro') {
    store.dendro.gauge = gaugeUnits;
  }

  return 0;
}
