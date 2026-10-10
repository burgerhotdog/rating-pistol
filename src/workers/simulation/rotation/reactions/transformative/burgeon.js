import { buildTransformativeReactionSnapshot } from '../../snapshot';

export function reactBurgeon(ctx, applier) {
  const { aura, globalCooldowns } = ctx.states;

  const bloomState = aura.bloom;
  const numCores = bloomState.cores.length;
  if (numCores === 0) return;

  bloomState.cores = [];

  ctx.runEffects('reaction', {
    reaction: 'burgeon',
    elements: ['dendro', 'pyro'],
    ownerId: applier,
  });

  if (globalCooldowns.burgeon?.length === 2) return;

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'burgeon', 'dendro');

    for (let i = 0; i < numCores; i++) {
      if (globalCooldowns.burgeon?.length !== 2) {
        (globalCooldowns.burgeon ??= []).push(500);
        ctx.snapshots.push(snapshot);
      }
    }
  }
}
