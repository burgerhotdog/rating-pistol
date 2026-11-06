const ruleHandlers = {
  arlecchinoMasque(ctx) {
    return ctx.states.bondOfLife['10000096'] ?? 0;
  },

  zaniOutro(ctx) {
    return ctx.states.negativeStatuses['spectroFrazzle']?.stacks ?? 0;
  },
};

export function getBuffRuleMult(ctx, rule) {
  const handler = ruleHandlers[rule];

  if (handler) {
    return handler(ctx);
  }
}
