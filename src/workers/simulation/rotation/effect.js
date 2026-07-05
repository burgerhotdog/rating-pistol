export function applyEffect(effectStates, effect, applyTimes) {
  const { intervalOffset } = effect;
  const prev = effectStates[effect.key] ?? {};
  const existingStacks = prev.stacks ?? 0;

  const next = {
    stacks: Math.min(existingStacks + applyTimes, effect.maxStacks),
    timeRemaining: effect.duration,
    usesRemaining: effect.maxUses,
    effect,
  };

  if ('intervalCooldown' in effect) {
    const existingEffectTimer = prev.intervalTimer;
    next.intervalTimer ??= existingEffectTimer ?? intervalOffset;
  }

  effectStates[effect.key] = next;
}
