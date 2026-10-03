export function hasGameRule(ctx, rule) {
  const { globalEffects } = ctx.states;

  for (const effectKey in globalEffects) {
    const { gameRule } = globalEffects[effectKey].effect;

    if (gameRule === rule) {
      return true;
    }
  }
}
