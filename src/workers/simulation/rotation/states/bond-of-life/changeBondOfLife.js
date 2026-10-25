export function changeBondOfLife(ctx, memberId, value) {
  const store = ctx.states.bondOfLife;
  const prev = store[memberId];

  const overflowHealing = value < 0
    ? -Math.min(prev + value, 0)
    : null;

  if (prev === 0) return overflowHealing;

  store[memberId] = Math.max(prev + value, 0);
  ctx.runEffects('bondOfLifeUpdate', {
    ownerId: memberId,
    bondOfLife: { value },
  });

  if (store[memberId] === 0) {
    ctx.runEffects('bondOfLifeClear', { ownerId: memberId });
  }

  return overflowHealing;
}
