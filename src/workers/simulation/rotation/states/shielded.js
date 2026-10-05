export function advanceShielded(ctx, elapsed) {
  const { states } = ctx;
  if (!states.shielded) return;

  const remaining = states.shielded -= elapsed;

  if (remaining <= 0) {
    states.shielded = false;
  }
}

export function updateShielded(ctx, action) {
  const { states } = ctx;
  const duration = action.shield?.duration;
  if (!duration) return;

  states.shielded = Math.max(duration, states.shielded ?? 0);
}
