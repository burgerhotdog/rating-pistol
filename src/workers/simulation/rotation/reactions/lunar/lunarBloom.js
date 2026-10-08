import { hasGameRule } from '../../states';

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

  if (hasGameRule(ctx, 'moonridgeDew')) {
    state.moonridgeDew = Math.min(state.moonridgeDew + 1, 3);
  }
}

export function consumeVerdantDew(ctx, maxConsumedStacks) {
  const state = ctx.states.aura.lunarBloom;
  if (!state) return 0;

  const stacksAvailable = state.verdantDew + state.moonridgeDew;
  const consumedStacks = Math.min(maxConsumedStacks, stacksAvailable);

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
