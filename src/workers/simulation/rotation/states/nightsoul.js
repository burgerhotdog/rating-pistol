import { CHARACTER, GI } from '@/data';
import { clamp } from '@/utils';

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

export function updateNightsoulPoints(ctx, action) {
  const nightsoulStore = ctx.states.nightsoul;
  const { ownerId, nightsoul: points } = action;
  if (!points) return;

  const prev = nightsoulStore[ownerId];
  const next = prev + points;

  const limit = CHARACTER[GI][ownerId].maxNightsoul ?? Infinity;

  nightsoulStore[ownerId] = clamp(next, 0, limit);

  ctx.runEffects('nightsoulUpdate', action);
}
