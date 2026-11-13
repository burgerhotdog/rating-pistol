import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { decayBuffUses } from '../../states';

const hyperbloomAction = {
  damage: {
    type: 'hyperbloom',
    element: 'dendro',
  },
};

const hyperbloomReaction = {
  reaction: 'hyperbloom',
  elements: ['dendro', 'electro'],
};

export function reactHyperbloom(ctx, applier) {
  const { aura, globalCooldowns } = ctx.states;

  const bloomState = aura.bloom;
  const numCores = bloomState.cores.length;
  if (numCores === 0) return;

  bloomState.cores = [];

  ctx.runEffects('reaction', { ownerId: applier, reaction: hyperbloomReaction });

  if (globalCooldowns.hyperbloom?.length === 2) return;

  for (let i = 0; i < numCores; i++) {
    if (globalCooldowns.hyperbloom?.length !== 2) {
      (globalCooldowns.hyperbloom ??= []).push(500);

      if (ctx.saveSnapshots) {
        const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'hyperbloom', 'dendro');
        ctx.snapshots.push(snapshot);
      }

      decayBuffUses(ctx, hyperbloomAction, [applier]);

      ctx.runEffects('hit', { action: hyperbloomAction });
    }
  }
}
