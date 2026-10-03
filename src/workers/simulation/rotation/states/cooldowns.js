export function applyCooldown(ctx, effectKey, duration) {
  const store = ctx.states.applyCooldowns;
  store[effectKey] = duration;
}

export function advanceCooldowns(ctx, elapsed) {
  const store = ctx.states.applyCooldowns;

  for (const effectKey in store) {
    const remaining = store[effectKey] -= elapsed;

    if (remaining <= 0) {
      delete store[effectKey];
    }
  }
}
