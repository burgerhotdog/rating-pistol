export function advanceShielded(ctx, elapsed) {
  const { states } = ctx;
  if (!states.shielded) return;

  const remaining = states.shielded -= elapsed;

  if (remaining <= 0) {
    states.shielded = false;
  }
}
