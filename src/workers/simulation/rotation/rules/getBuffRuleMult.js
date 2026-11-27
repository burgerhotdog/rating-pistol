const ruleHandlers = {
  neuvillette_a4(ctx) {
    const health = ctx.states.memberHealth[10000087];
    const stacks = (health - 0.3) / 0.01;
    return Math.min(stacks, 50);
  },

  arlecchinoMasque(ctx) {
    return ctx.states.bondOfLife[10000096] ?? 0;
  },

  ifa_a1(ctx) {
    let totalNightsoulPoints = 0;
    for (const memberIdStr in ctx.states.nightsoul) {
      const { points } = ctx.states.nightsoul[memberIdStr];
      totalNightsoulPoints += points;
    }

    const rescueEssentials = Math.min(150, totalNightsoulPoints);
    return rescueEssentials;
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
