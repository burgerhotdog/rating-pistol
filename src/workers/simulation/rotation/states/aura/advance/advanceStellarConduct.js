export function advanceStellarConduct(ctx, elapsed) {
  const auraStore = ctx.states.aura;
  let remaining = elapsed;

  while (auraStore.stellarConduct && remaining > 0) {
    const state = auraStore.stellarConduct;
    const decrease = Math.min(state.timeLeft, state.timer, remaining);

    remaining -= decrease;
    state.timeLeft -= decrease;
    state.timer -= decrease;
    if (state.timeLeft === 0) {
      delete auraStore.stellarConduct;
      return;
    }

    if (auraStore.stellarConduct?.timer === 0) {
      const hits = Math.min(state.hits, 12);
      state.multiplier = hits ? 1.4 + hits * 0.05 : 1;
      state.bonus = hits ? 0.28 + hits * 0.01 : 0.2;

      state.timer = 4000;
      state.hits = 0;
    }
  }
}
