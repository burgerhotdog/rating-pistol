export function grantBondOfLife(ctx, action) {
  if (!action.bondOfLife) return;

  const { targets = [action.ownerId], value } = action.bondOfLife;
  const store = ctx.states.bondOfLife;
  if (!value) return;

  for (const memberId of targets) {
    store[memberId] = Math.max(store[memberId] + value, 0);
    ctx.runEffects('bondOfLifeChange', action);
  }
}

export function changeBondOfLife(ctx, memberId, value) {
  const store = ctx.states.bondOfLife;
  if (store[memberId] === 0) return;

  store[memberId] = Math.max(store[memberId] + value, 0);
  ctx.runEffects('bondOfLifeChange', { ownerId: memberId, bondOfLife: { value } });

  if (store[memberId] === 0) {
    ctx.runEffects('bondOfLifeClear', { ownerId: memberId });
  }
}
