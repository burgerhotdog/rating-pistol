export function reactElectroCharged(ctx, ownerId) {
  const state = ctx.states.aura.electroCharged ??= {
    reaction: 'electroCharged',
    timer: 0,
  };

  state.ownerId = ownerId;

  ctx.runEffects('reaction', {
    reaction: 'electroCharged',
    elements: ['electro', 'hydro'],
    ownerId,
  });
}
