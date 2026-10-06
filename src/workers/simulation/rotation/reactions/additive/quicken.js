export function reactQuicken(ctx, ownerId) {
  ctx.runEffects('reaction', {
    reaction: 'quicken',
    elements: ['dendro', 'electro'],
    ownerId,
  });

  return;
}
