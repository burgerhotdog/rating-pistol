export function updateUnison(ctx, action) {
  if (!action.unison) return;
  const unisonStore = ctx.states.unison;

  const prev = unisonStore[action.ownerId];
  const next = action.unison;
  if (prev === next) return;

  unisonStore[action.ownerId] = next;

  ctx.runEffects('unisonUpdate', action);
}

export function advanceUnison(ctx, elapsed) {
  const state = ctx.states.unisonBoon;
  if (!state?.stacks || !state?.timeLeft) return;

  state.timeLeft = Math.max(state.timeLeft - elapsed, 0);

  if (!state.timeLeft) {
    state.stacks = 0;
    state.appliers.clear();
  }
}
