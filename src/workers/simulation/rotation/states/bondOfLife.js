export function updateBondOfLife(ctx, action) {
  const { ownerId, bondOfLife } = action;
  if (!bondOfLife) return;

  const bolStore = ctx.states.bondOfLife;
  const prev = bolStore[ownerId];
  const next = Math.max(prev + bondOfLife, 0);

  if (prev !== next) {
    bolStore[ownerId] = next;
    ctx.runEffects('bondOfLifeUpdate', { action });
  }

  // return overflow healing
  if (bondOfLife < 0 && next === 0) {
    return -Math.min(prev + bondOfLife, 0);
  }
}
