const REACTION_DEFS = {
  stellarConduct: {
    reaction: 'stellarConduct',
    elements: ['cryo', 'electro'],
  },
  stellarSwirl: {
    reaction: 'stellarSwirl',
    elements: ['cryo', 'anemo'],
  },
};

export function reactStellarConduct(ctx, ownerId) {
  const state = ctx.states.aura.stellarConduct ??= {
    reaction: 'stellarConduct',
    prevHits: 0,
    multiplier: 1,
    bonus: 0.2,
    hits: 0,
    timer: 4000,
  };
  state.timeLeft = 7000;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.stellarConduct,
    ownerId,
  });
}
