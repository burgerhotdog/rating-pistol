const handlers = {
  neuvillette_a4(ctx) {
    const health = ctx.states.memberHealth[10000087];
    const stacks = (health - 0.3) / 0.01;
    return Math.min(stacks, 50);
  },

  arlecchinoMasque(ctx) {
    return ctx.states.bondOfLife[10000096] ?? 0;
  },

  ifa_a1(ctx) {
    const hasC2 = ctx.hasRule('ifa_c2');

    let totalCurrNsPoints = 0;
    for (const memberIdStr in ctx.states.nightsoul) {
      const { points } = ctx.states.nightsoul[memberIdStr];
      totalCurrNsPoints += points;
    }

    let rescueEssentialsPoints = totalCurrNsPoints;
    if (hasC2) {
      rescueEssentialsPoints += 4 * Math.max(0, totalCurrNsPoints - 60);
    }

    const rescueEssentialsLimit = hasC2 ? 200 : 150;
    return Math.min(rescueEssentialsLimit, rescueEssentialsPoints);
  },

  zaniOutro(ctx) {
    return ctx.states.negativeStatuses.spectroFrazzle?.stacks ?? 0;
  },
};

export function getBuffRuleMult(ctx, rule) {
  const handler = handlers[rule];

  if (handler) {
    return handler(ctx);
  }
}
