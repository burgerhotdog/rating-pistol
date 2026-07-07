export const isOnCooldown = (ctx, type, effectKey) => {
  const { state } = ctx;

  return (state.cooldowns[type][effectKey] ?? 0) > 0;
};

export function setCooldown(ctx, type, effectKey, duration) {
  const { state } = ctx;

  state.cooldowns[type][effectKey] = duration;
}

export function advanceCooldowns(ctx, elapsed) {
  const { state } = ctx;

  for (const type of ['apply', 'use']) {
    const entries = state.cooldowns[type];

    for (const effectKey in entries) {
      entries[effectKey] -= elapsed;

      if (entries[effectKey] <= 0) {
        delete entries[effectKey];
      }
    }
  }
}
