import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactBloom(ctx, applier, auraElement, gaugeUnits) {
  const state = ctx.states.aura.bloom ??= {
    reaction: 'bloom',
    cores: [],
  };

  state.cores.push({
    timeLeft: 6000,
    ownerId: applier,
  });

  if (state.cores.length > 5) {
    const oldestCore = state.cores.shift();

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, oldestCore.ownerId, 'bloom', 'dendro');
      ctx.snapshots.push(snapshot);
    }
  }

  const consumeUnits = auraElement === 'hydro'
    ? gaugeUnits * 2
    : gaugeUnits / 2;

  const excessGaugeUnits = consumeAura(ctx.states.aura, auraElement, consumeUnits);

  ctx.runEffects('reaction', {
    reaction: 'bloom',
    elements: ['dendro', 'hydro'],
    ownerId: applier,
  });

  return excessGaugeUnits;
}
