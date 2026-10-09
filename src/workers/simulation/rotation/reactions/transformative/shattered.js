import { buildTransformativeReactionSnapshot } from '../../snapshot';

export function reactShattered(ctx, ownerId) {
  const auraStore = ctx.states.aura;

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, ownerId, 'shattered', 'physical');
    ctx.snapshots.push(snapshot);
  }

  delete auraStore.frozen;

  ctx.runEffects('reaction', {
    reaction: 'shattered',
    ownerId,
  });
}
