export function applyAura(ctx, element, gauge) {
  const aura = ctx.states.aura[element] ??= { element };

  aura.decayRate ??= ((35 / (4 * gauge)) + (25 / 8)) * 1000;
  aura.gauge = Math.max(aura.gauge ?? 0, gauge * 0.8);
}
