const baseStackLimits = {
  glacioChafe: 10,
  fusionBurst: 10,
  electroFlare: 10,
  aeroErosion: 3,
  spectroFrazzle: 10,
  havocBane: 3,
};

export function getStackLimit(ctx, statusKey) {
  let stackLimit = baseStackLimits[statusKey];

  for (const effectKey in ctx.states.globalEffects) {
    const { rule } = ctx.states.globalEffects[effectKey].effect

    if (rule === 'roverAero2' && statusKey !== 'aeroErosion') {
      stackLimit += 3;
    }

    if (rule === 'chisa') {
      stackLimit += 3;
    }

    if (rule === 'suisui' && statusKey !== 'havocBane') {
      stackLimit += 3;
    }
  }

  return stackLimit;
}
