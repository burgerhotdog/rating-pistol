export function getTuneBoundary(ctx) {
  const { shiftingTimeLeft, interferedTimeLeft } = ctx.states.tune;

  return Math.min(
    shiftingTimeLeft > 0 ? shiftingTimeLeft : Infinity,
    interferedTimeLeft > 0 ? interferedTimeLeft : Infinity,
  );
}

export function advanceTuneTimers(ctx, elapsed) {
  const { tune } = ctx.states;

  if (tune.offTuneCooldown) {
    tune.offTuneCooldown -= elapsed;
    if (tune.offTuneCooldown <= 0)
      delete tune.offTuneCooldown;
  }

  if (tune.shiftingTimeLeft) {
    tune.shiftingTimeLeft -= elapsed;
    if (tune.shiftingTimeLeft <= 0) {
      delete tune.shifting;
      delete tune.shiftingTimeLeft;
      delete tune.strainAppliers;
    }
  }

  if (tune.interferedTimeLeft) {
    tune.interferedTimeLeft -= elapsed;
    if (tune.interferedTimeLeft <= 0) {
      delete tune.interfered;
      delete tune.interferedTimeLeft;
      delete tune.interferedStacks;
    }
  }
}
