import { buildTransformativeReactionSnapshot } from '../../snapshot';

export function reactHyperbloom(ctx, applier) {
  const state = ctx.states.aura.bloom;
  const numCores = state.cores.length;
  if (numCores === 0) return;

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'hyperbloom', 'dendro');

    for (let i = 0; i < Math.min(numCores, 2); i++) {
      ctx.snapshots.push(snapshot);
    }
  }

  state.cores = [];

  ctx.runEffects('reaction', {
    reaction: 'hyperbloom',
    elements: ['dendro', 'electro'],
    ownerId: applier,
  });
}
