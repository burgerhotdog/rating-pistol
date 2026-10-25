export function grantBondOfLife(ctx, action) {
  if (!action.bondOfLife) return;

  const { targets, value } = action.bondOfLife;
  const store = ctx.states.bondOfLife;
  if (!value) return;

  for (const memberId of targets) {
    store[memberId] = Math.max(store[memberId] + value, 0);
    ctx.runEffects('bondOfLifeUpdate', { ...action, ownerId: memberId });
  }
}
