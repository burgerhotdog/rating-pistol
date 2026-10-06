export function runUseEffect(ctx, state, use = {}, spec = {}) {
  const { store, effect, stacks } = state;

  let inflictStackMult = 1;
  if (use.perStatusInflict) {
    inflictStackMult = spec.inflict?.status?.[use.perStatusInflict] ?? 0
  }

  if (use.action) {
    const useTimes = (use.times ?? 1) * inflictStackMult * stacks;
    state.isRunning = true;

    for (const [index, action] of use.action.entries()) {
      const runOptions = {
        runtimeOffset: spec.runtimeOffset,
        noDuration: true,
      };

      if (effect.snapshotBuffs) {
        runOptions.snapshotBuffs = spec.snapshotBuffs[index];
      }

      for (let i = 0; i < useTimes; i++) {
        ctx.runAction(action, runOptions);
      }
    }

    delete state.isRunning;
  }

  if (use.cooldown) {
    state.useCooldown = use.cooldown;
  }

  if (state.usesLeft) {
    state.usesLeft--;

    if (state.usesLeft <= 0) {
      delete store[effect.key];
      return true;
    }
  }
}
