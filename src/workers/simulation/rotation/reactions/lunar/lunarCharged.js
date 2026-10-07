export function reactLunarCharged(ctx, ownerId) {
  ctx.states.aura.lunarCharged ??= {
    reaction: 'lunarCharged',
    timer: 0,
  };

  ctx.runEffects('reaction', {
    reaction: 'lunarCharged',
    elements: ['electro', 'hydro'],
    ownerId,
  });
}
