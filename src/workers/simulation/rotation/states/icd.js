export function advanceIcds(ctx, elapsed) {
  const { states } = ctx;

  for (const memberId in states.icd) {
    const store = states.icd[memberId];

    for (const state of Object.values(store)) {
      state.timeLeft -= elapsed;

      if (state.timeLeft <= 0) {
        delete store[state.tag];
      }
    }
  }
}
