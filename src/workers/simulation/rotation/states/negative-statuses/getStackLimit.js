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
    const { gameRule } = ctx.states.globalEffects[effectKey].effect

    if (gameRule === 'roverAero2' && statusKey !== 'aeroErosion') {
      stackLimit += 3;
    }

    if (gameRule === 'chisa') {
      stackLimit += 3;
    }

    if (gameRule === 'suisui' && statusKey !== 'havocBane') {
      stackLimit += 3;
    }
  }

  return stackLimit;
}
