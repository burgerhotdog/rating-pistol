export function changeBondOfLife(ctx, memberId, value) {
  const store = ctx.states.bondOfLife;
  if (store[memberId] === 0) return;

  store[memberId] = Math.max(store[memberId] + value, 0);
  ctx.runEffects('bondOfLifeUpdate', { ownerId: memberId, bondOfLife: { value } });

  if (store[memberId] === 0) {
    ctx.runEffects('bondOfLifeClear', { ownerId: memberId });
  }
}
