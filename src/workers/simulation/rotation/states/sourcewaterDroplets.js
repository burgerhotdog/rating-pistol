export function updateSourcewaterDroplets(ctx, action) {
  if (!Object.hasOwn(action, 'sourcewaterDroplets')) return;

  const state = ctx.states.sourcewaterDroplets;

  const prev = state.count;
  const change = action.sourcewaterDroplets;
  const next = Math.max(prev + change, 0);

  if (prev === next) return;

  while (state.timers.length !== next) {
    if (state.timers.length > next) {
      state.timers.shift();
    } else {
      state.timers.push(15000);
    }
  }

  state.count = next;

  ctx.runEffects('sourcewaterDropletsUpdate', { action });
}

export function advanceSourcewaterDroplets(ctx, elapsed) {
  const state = ctx.states.sourcewaterDroplets;

  for (let i = 0; i < state.count; i++) {
    state.timers[i] -= elapsed;
  }

  while (state.timers[0] <= 0) {
    state.timers.shift();
  }

  state.count = state.timers.length;
}
