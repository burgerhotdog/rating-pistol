export const isOnCooldown = (cooldowns, type, effectKey) => {
  return (cooldowns[type][effectKey] ?? 0) > 0;
};

export function setCooldown(cooldowns, type, effectKey, duration) {
  cooldowns[type][effectKey] = duration;
}

export function advanceCooldowns(cooldowns, elapsed) {
  for (const type of ['apply', 'use']) {
    const typeCooldowns = cooldowns[type];

    for (const key in typeCooldowns) {
      typeCooldowns[key] -= elapsed;

      if (typeCooldowns[key] <= 0) {
        delete typeCooldowns[key];
      }
    }
  }
}
