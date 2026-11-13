import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { decayBuffUses } from '../../states';

const shatteredAction = {
  damage: {
    type: 'shattered',
    element: 'physical',
  },
};

const shatteredReaction = {
  reaction: 'shattered',
};

export function reactShattered(ctx, ownerId) {
  const auraStore = ctx.states.aura;

  let wasHit;

  if (ctx.states.globalCooldowns.shattered?.length !== 2) {
    (ctx.states.globalCooldowns.shattered ??= []).push(500);
    wasHit = true;

    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'shattered', 'physical');
      ctx.snapshots.push(snapshot);
    }

    decayBuffUses(ctx, shatteredAction, [ownerId]);
  }

  delete auraStore.frozen;

  ctx.runEffects('reaction', { ownerId, reaction: shatteredReaction });
  if (wasHit) {
    ctx.runEffects('hit', { action: shatteredAction });
  }
}
