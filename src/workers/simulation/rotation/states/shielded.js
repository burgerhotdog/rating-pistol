export function advanceShielded(ctx, elapsed) {
  const { states } = ctx;
  if (!states.shielded) return;

  const remaining = states.shielded -= elapsed;

  if (remaining <= 0) {
    states.shielded = false;
  }
}

export function updateShielded(ctx, shield) {
  const prev = ctx.states.shielded ?? 0;
  const next = Math.max(shield.duration, prev);

  ctx.states.shielded = next;
}
