export function consumeNegativeStatuses(ctx, action) {
  const store = ctx.states.negativeStatuses;
  const toConsume = action.consume?.status ?? {};

  for (const [id, stacks] of Object.entries(toConsume)) {
    const state = store[id];
    if (!state) continue;

    state.stacks -= stacks;

    if (state.stacks <= 0) {
      delete store[id];
    }
  }
}
