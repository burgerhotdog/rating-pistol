export function reactAggravate(ctx, ownerId) {
  ctx.runEffects('reaction', {
    reaction: 'aggravate',
    elements: ['dendro', 'electro'],
    ownerId,
  });

  return;
}
