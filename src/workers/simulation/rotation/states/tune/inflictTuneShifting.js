export function inflictTuneShifting(ctx, action) {
  if (!action.inflict?.shifting) return;
  const { tune } = ctx.states;

  tune.shifting = action.inflict.shifting;
  tune.shiftingTimeLeft = 25000;

  if (action.inflict.shifting === 'tuneStrain') {
    tune.strainAppliers ??= new Set();
    tune.strainAppliers.add(action.ownerId);
  }
}
