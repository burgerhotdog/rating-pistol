export const createCdTracker = () => {
  return { apply: {}, use: {} };
};

export const isOnCooldown = (ctx, type, effectKey) => {
  const { cooldowns } = ctx;

  return (cooldowns[type][effectKey] ?? 0) > 0;
};

export function setCooldown(ctx, type, effectKey, duration) {
  const { cooldowns } = ctx;

  cooldowns[type][effectKey] = duration;
}

export function advanceCooldowns(ctx, elapsed) {
  const { cooldowns } = ctx;

  for (const type of ['apply', 'use']) {
    const entries = cooldowns[type];

    for (const effectKey in entries) {
      entries[effectKey] -= elapsed;

      if (entries[effectKey] <= 0) {
        delete entries[effectKey];
      }
    }
  }
}
