export function advanceQuicken(auraStore, elapsed) {
  const state = auraStore.quicken;

  state.gauge -= elapsed * state.decayRate;

  const isDepleted = state.gauge <= 0;

  if (isDepleted) {
    delete auraStore.quicken;
  }

  return isDepleted;
}
