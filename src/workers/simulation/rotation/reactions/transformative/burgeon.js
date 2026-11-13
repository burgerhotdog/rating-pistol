import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { decayBuffUses } from '../../states';

const burgeonReaction = {
  reaction: 'burgeon',
  elements: ['dendro', 'pyro'],
};

const burgeonAction = {
  damage: {
    type: 'burgeon',
    element: 'dendro',
  },
};

export function reactBurgeon(ctx, applier) {
  const { aura, globalCooldowns } = ctx.states;

  const bloomState = aura.bloom;
  const numCores = bloomState.cores.length;
  if (numCores === 0) return;

  bloomState.cores = [];

  ctx.runEffects('reaction', { ownerId: applier, reaction: burgeonReaction });

  if (globalCooldowns.burgeon?.length === 2) return;

  for (let i = 0; i < numCores; i++) {
    if (globalCooldowns.burgeon?.length !== 2) {
      (globalCooldowns.burgeon ??= []).push(500);

      if (ctx.saveSnapshots) {
        const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'burgeon', 'dendro');
        ctx.snapshots.push(snapshot);
      }

      decayBuffUses(ctx, burgeonAction, [applier]);

      ctx.runEffects('hit', { action: burgeonAction });
    }
  }
}
