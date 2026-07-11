export function advanceCooldowns(cooldowns, elapsed) {
  for (const key in cooldowns) {
    cooldowns[key] -= elapsed;

    if (cooldowns[key] <= 0) {
      delete cooldowns[key];
    }
  }
}
