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
  ctx.runEffects('nightsoulBurst');
}

export function updateNightsoulPoints(ctx, action) {
  if (!action.nightsoul) return;

  const { blessing, value, reset } = action.nightsoul;
  const state = ctx.states.nightsoul[action.ownerId];

  if (value != null) {
    const { maxNightsoul = Infinity } = CHARACTER[GI][action.ownerId];
    state.points = clamp(state.points + value, 0, maxNightsoul);

    if (value < 0 && ctx.hasRule('fightingSpirit')) {
      ctx.runCommands(10000106, [{
        type: 'apply',
        key: '10000106.10000106:effect3',
        spec: { stacks: -value },
      }], action.ownerId);
    }
  }

  if (blessing != null) {
    state.blessing = blessing;
  }

  if (reset) {
    state.points = 0;
  }

  ctx.runEffects('nightsoulUpdate', action);
}
