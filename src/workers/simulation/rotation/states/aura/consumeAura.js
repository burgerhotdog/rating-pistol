export function consumeAura(ctx, element, gaugeUnits) {
  const store = ctx.states.aura;
  const state = store[element];

  const excessGaugeUnits = Math.max(gaugeUnits - state.gauge, 0);
  state.gauge -= gaugeUnits;

  if (state.gauge <= 0) {
    delete store[element];
  }

  return excessGaugeUnits;
}
