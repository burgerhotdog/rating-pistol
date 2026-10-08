import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactBloom(ctx, applier, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const bloomState = auraStore.bloom ??= {
    reaction: 'bloom',
    cores: [],
  };

  bloomState.cores.push({
    timeLeft: 6000,
    ownerId: applier,
  });

  if (bloomState.cores.length > 5) {
    const oldestCore = bloomState.cores.shift();

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, oldestCore.ownerId, 'bloom', 'dendro');
      ctx.snapshots.push(snapshot);
    }
  }

  const unitsModifier = auraElement === 'hydro' ? 2 : 0.5;

  const excess = consumeAura(auraStore, auraElement, gaugeUnits * unitsModifier) / unitsModifier;

  ctx.runEffects('reaction', {
    reaction: 'bloom',
    elements: ['dendro', 'hydro'],
    ownerId: applier,
  });

  return excess;
}
