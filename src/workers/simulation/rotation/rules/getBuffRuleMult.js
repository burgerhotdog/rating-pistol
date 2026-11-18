const ruleHandlers = {
  neuvillette_a4(ctx) {
    const health = ctx.states.memberHealth[10000087];
    const stacks = (health - 0.3) / 0.01;
    return Math.min(stacks, 50);
  },

  arlecchinoMasque(ctx) {
    return ctx.states.bondOfLife[10000096] ?? 0;
  },

  zaniOutro(ctx) {
    return ctx.states.negativeStatuses.spectroFrazzle?.stacks ?? 0;
  },
};

export function getBuffRuleMult(ctx, rule) {
  const handler = ruleHandlers[rule];

  if (handler) {
    return handler(ctx);
  }
}
