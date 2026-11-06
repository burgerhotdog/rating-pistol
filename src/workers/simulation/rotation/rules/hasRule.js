export function hasRule(ctx, rule) {
  const { globalEffects } = ctx.states;

  for (const effectKey in globalEffects) {
    const { effect } = globalEffects[effectKey];

    if (effect.rule === rule) {
      return true;
    }
  }
}
