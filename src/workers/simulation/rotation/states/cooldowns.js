export function applyCooldown(ctx, effectKey, duration) {
  const store = ctx.states.applyCooldowns;
  store[effectKey] = duration;
}

function advanceCooldownStore(store, elapsed) {
  for (const key in store) {
    const remaining = store[key] -= elapsed;

    if (remaining <= 0) {
      delete store[key];
    }
  }
}

export function advanceCooldowns(ctx, elapsed) {
  const { globalCooldowns, applyCooldowns } = ctx.states;

  advanceCooldownStore(globalCooldowns, elapsed);
  advanceCooldownStore(applyCooldowns, elapsed);
}
