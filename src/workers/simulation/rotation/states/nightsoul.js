export function tryNightsoulBurst(ctx, action) {
  const { cache, states } = ctx;
  const { globalCooldowns } = states;

  const nightsoulBurstInterval = cache.nightsoulBurst;
  if (!nightsoulBurstInterval) return;
  if (!action.damage?.compressed) return;
  if (globalCooldowns.nightsoulBurst) return;

  globalCooldowns.nightsoulBurst = nightsoulBurstInterval;
  ctx.runEffects('nightsoulBurst', action);
}
