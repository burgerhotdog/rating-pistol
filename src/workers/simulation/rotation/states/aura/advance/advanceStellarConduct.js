export function advanceStellarConductTimers(ctx, step) {
  const auraStore = ctx.states.aura;
  const state = auraStore.stellarConduct;
  if (!state) return;

  state.timeLeft -= step;
  state.timer -= step;

  if (state.timeLeft <= 0) {
    delete auraStore.stellarConduct;
    return;
  }

  if (state.timer <= 0) {
    const hits = Math.min(state.hits, 12);
    state.multiplier = hits ? 1.4 + hits * 0.05 : 1;
    state.bonus = hits ? 0.28 + hits * 0.01 : 0.2;

    state.timer = 4000;
    state.hits = 0;
  }
}
