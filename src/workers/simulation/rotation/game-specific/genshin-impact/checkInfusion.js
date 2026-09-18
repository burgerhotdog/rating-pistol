export function checkInfusion(ctx, action) {
  const { ownerId, category, damage } = action;
  if (category !== 'normalAttack' || damage?.element !== 'physical') return;

  const store = ctx.states.memberEffects[ownerId];
  for (const effectKey in store) {
    const state = store[effectKey];
    const { effect } = state;
    const { buff } = effect;

    // SIMPLIFIED
    const infusionElement = buff?.infusion;
    if (infusionElement) {
      return infusionElement;
    }
  }
}
