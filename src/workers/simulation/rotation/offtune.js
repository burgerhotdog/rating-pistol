const buildTuneBreakFootprint = (ctx, shifting) => {
  return {
    key: `misc:${shifting}`,
    ownerId: 'misc',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: 100000,
  };;
}; 

export function applyTune(ctx, action) {
  const { offTuneState } = ctx;
  if (offTuneState.cooldown) return;

  if ('shiftTune' in action) {
    offTuneState.shifting = action.shiftTune;
  }

  offTuneState.level++;

  if (offTuneState.level >= 30) {
    offTuneState.cooldown = 4000;
    offTuneState.level = 0;
    
    if (ctx.recordFootprint) {
      const footprint = buildTuneBreakFootprint(ctx, offTuneState.shifting);
      ctx.footprints.push(footprint);
    }

    if (offTuneState.shifting) {
      offTuneState.interfered = offTuneState.shifting;
      offTuneState.duration = 8000;
    }            
  }
}

export function advanceTune(ctx, elapsed) {
  const { offTuneState } = ctx;

  if (offTuneState.cooldown) {
    offTuneState.cooldown -= elapsed;

    if (offTuneState.cooldown <= 0) {
      delete offTuneState.cooldown;
    }
  }

  if (offTuneState.duration) {
    offTuneState.duration -= elapsed;

    if (offTuneState.duration <= 0) {
      delete offTuneState.interfered;
      delete offTuneState.duration;
    }
  }
}
