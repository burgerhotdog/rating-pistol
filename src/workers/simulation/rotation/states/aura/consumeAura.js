export function consumeAura(ctx, state, gauge) {
  const remaining = Math.max(gauge - state.gauge, 0);
  state.gauge -= gauge;

  if (state.gauge <= 0) {
    delete ctx.states.aura[state.element];
  }

  return remaining;
}
