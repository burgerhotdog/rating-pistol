import { buildTransformativeReactionSnapshot } from '../../snapshot';

export function reactHyperbloom(ctx, applier) {
  const { aura, globalCooldowns } = ctx.states;

  const bloomState = aura.bloom;
  const numCores = bloomState.cores.length;
  if (numCores === 0) return;

  bloomState.cores = [];

  ctx.runEffects('reaction', {
    reaction: 'hyperbloom',
    elements: ['dendro', 'electro'],
    ownerId: applier,
  });

  if (globalCooldowns.hyperbloom?.length === 2) return;

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'hyperbloom', 'dendro');

    for (let i = 0; i < numCores; i++) {
      if (globalCooldowns.hyperbloom?.length !== 2) {
        (globalCooldowns.hyperbloom ??= []).push(500);
        ctx.snapshots.push(snapshot);
      }
    }
  }
}
