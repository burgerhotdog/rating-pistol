export function applyAura(ctx, element, gauge) {
  const aura = ctx.states.aura[element] ??= { element };

  aura.decayRate ??= ((35 / (4 * gauge)) + (25 / 8)) * 1000;
  aura.gauge = Math.max(aura.gauge ?? 0, gauge * 0.8);
}

export function consumeAura(ctx, state, gauge) {
  const remaining = Math.max(gauge - state.gauge, 0);
  state.gauge -= gauge;

  if (state.gauge <= 0) {
    delete ctx.states.aura[state.element];
  }

  return remaining;
}
