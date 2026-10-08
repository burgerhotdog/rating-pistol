function decayBuffState(ctx, action, state) {
  const { effect, buffCooldown } = state;
  if (buffCooldown) return;
  if (!effect.buff) return;
  const spec = { action, fieldId: action.ownerId };
  if (!ctx.eventFilter(effect.buff?.filter, effect, spec)) return;

  if (effect.buff?.cooldown) {
    state.buffCooldown = effect.buff.cooldown;
  }

  if (state.usesLeft) {
    state.usesLeft--;

    if (!state.usesLeft) {
      delete state.store[effect.key];
    }
  }
}

export function decayBuffUses(ctx, action) {
  const { globalEffects, memberEffects } = ctx.states;

  for (const effectKey in globalEffects) {
    const state = globalEffects[effectKey];
    decayBuffState(ctx, action, state);
  }

  const memberStore = memberEffects[action.ownerId];

  for (const effectKey in memberStore) {
    const state = memberStore[effectKey];
    decayBuffState(ctx, action, state);
  }
}
