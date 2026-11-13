const lunarChargedReaction = {
  reaction: 'lunarCharged',
  elements: ['electro', 'hydro'],
};

export function reactLunarCharged(ctx, ownerId) {
  ctx.states.aura.lunarCharged ??= {
    reaction: 'lunarCharged',
    timer: 0,
  };

  ctx.runEffects('reaction', { ownerId, reaction: lunarChargedReaction });
}
