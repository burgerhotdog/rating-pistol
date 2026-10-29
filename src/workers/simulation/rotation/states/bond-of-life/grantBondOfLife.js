export function grantBondOfLife(ctx, action) {
  if (!action.bondOfLife) return;

  const { ownerId, bondOfLife } = action;

  const store = ctx.states.bondOfLife;

  store[ownerId] = Math.max(store[ownerId] + bondOfLife, 0);

  ctx.runEffects('bondOfLifeUpdate', action);
}
