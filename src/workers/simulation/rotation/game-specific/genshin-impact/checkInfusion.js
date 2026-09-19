export function checkInfusion(ctx, action) {
  const { ownerId, category, damage } = action;
  if (category !== 'normalAttack' || damage?.element !== 'physical') return;

  const store = ctx.states.memberEffects[ownerId];
  for (const effectKey in store) {
    const { buff } = store[effectKey].effect;

    // SIMPLIFIED
    const infusionElement = buff?.infusion;
    if (infusionElement) {
      return infusionElement;
    }
  }
}
