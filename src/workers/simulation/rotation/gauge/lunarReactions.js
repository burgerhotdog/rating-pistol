import { consumeAura } from '../states/aura';
import { buildElevationSnapshot } from '../snapshot';
import { hasGameRule } from '../states/gameRules';

export function reactLunarCharged(ctx, ownerId) {
  ctx.states.aura.lunarCharged ??= {
    reaction: 'lunarCharged',
    timeLeft: 0,
  };

  ctx.runEffects('reaction', {
    reaction: 'lunarCharged',
    elements: ['electro', 'hydro'],
    ownerId,
  });
}

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

export function reactLunarCrystallize(ctx, ownerId) {
  const state = ctx.states.aura.lunarCrystallize ??= {
    reaction: 'lunarCrystallize',
    timesLeft: 3,
  };

  ctx.runEffects('reaction', {
    reaction: 'lunarCrystallize',
    elements: ['geo', 'hydro'],
    ownerId,
  });

  state.timesLeft--;

  if (state.timesLeft === 0) {
    const snapshot = buildElevationSnapshot(ctx, 'lunarCrystallize');

    ctx.snapshots.push(snapshot);
    ctx.snapshots.push(snapshot);
    ctx.snapshots.push(snapshot);

    state.timesLeft = 3;
  }
}

export function tickLunarCharged(ctx, offset = 0) {
  const { aura } = ctx.states;

  if (!aura.electro || !aura.hydro) {
    delete aura.lunarCharged;
    return true;
  }

  if (ctx.saveSnapshots) {
    const snapshot = buildElevationSnapshot(ctx, 'lunarCharged');
    ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + offset });
  }

  consumeAura(ctx, aura.electro, 0.4);
  consumeAura(ctx, aura.hydro, 0.4);

  if (!aura.electro || !aura.hydro) {
    delete aura.lunarCharged;
    return true;
  }

  aura.lunarCharged.timeLeft = 2000;
  return false;
}
