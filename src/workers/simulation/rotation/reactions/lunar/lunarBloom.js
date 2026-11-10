import { GI } from '@/data';

export function reactLunarBloom(ctx, ownerId) {
  const state = ctx.states.aura.lunarBloom ??= {
    reaction: 'lunarBloom',
    verdantDew: 0,
    moonridgeDew: 0,
  };

  ctx.runEffects('reaction', {
    reaction: 'lunarBloom',
    elements: ['dendro', 'hydro'],
    ownerId,
  });

  state.verdantDew = Math.min(state.verdantDew + 1, 3);

  if (ctx.hasRule('moonridgeDew')) {
    state.moonridgeDew = Math.min(state.moonridgeDew + 1, 3);
  }
}

function consumeVerdantDew(ctx, action) {
  const maxConsumedStacks = action.verdantDew ?? 0;
  const state = ctx.states.aura.lunarBloom;
  if (!state) return 0;

  const stacksAvailable = state.verdantDew + state.moonridgeDew;
  const consumedStacks = Math.min(stacksAvailable, maxConsumedStacks);

  if (consumedStacks === stacksAvailable) {
    delete ctx.states.aura.lunarBloom;
    return consumedStacks;
  }

  const verdantToConsume = Math.min(consumedStacks, state.verdantDew);
  const moonridgeToConsume = consumedStacks - verdantToConsume;

  state.verdantDew -= verdantToConsume;
  state.moonridgeDew -= moonridgeToConsume;

  return consumedStacks;
}

export function getVerdantDewMult(ctx, action) {
  const { gameId, lunarBloom } = ctx.cache;
  if (gameId !== GI || !lunarBloom) return 1;
  if (!action.verdantDew) return 1;

  const consumedStacks = consumeVerdantDew(ctx, action);

  for (let i = 0; i < consumedStacks; i++) {
    ctx.runEffects('consumeVerdantDew', action);
  }

  return consumedStacks;
}
