const cooldownTracker = {
  apply: {},
  use: {},
};

export const isOnCooldown = (type, effectKey) => {
  if (!(type in cooldownTracker)) {
    throw new Error('Invalid cooldown type');
  }

  return (cooldownTracker[type][effectKey] ?? 0) > 0;
};

export function setCooldown(type, effectKey, duration) {
  if (!(type in cooldownTracker)) {
    throw new Error('Invalid cooldown type');
  }

  cooldownTracker[type][effectKey] = duration;
}

export function advanceCooldowns(elapsed) {
  for (const type of ['apply', 'use']) {
    const entries = cooldownTracker[type];

    for (const effectKey in entries) {
      const remaining = entries[effectKey] - elapsed;

      if (remaining > 0) {
        entries[effectKey] = remaining;
      } else {
        delete entries[effectKey];
      }
    }
  }
}

export function resetCooldowns() {
  cooldownTracker.apply = {};
  cooldownTracker.use = {};
}
