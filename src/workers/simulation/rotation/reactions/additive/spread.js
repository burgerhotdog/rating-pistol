export function reactSpread(ctx, ownerId) {
  ctx.runEffects('reaction', {
    reaction: 'spread',
    elements: ['dendro', 'electro'],
    ownerId,
  });

  return;
}
