import { runCommands } from './commands';
import { runUseEffect } from './runUseEffect';

function advanceEffectState(state, elapsed) {
  const { store, effect } = state;

  if (state.timeLeft > 0) {
    state.timeLeft -= elapsed;

    if (!effect.decay) {
      if (state.timeLeft <= 0) {
        return delete store[effect.key];
      }
    }

    while (state.timeLeft <= 0) {
      state.timeLeft += effect.decayDuration;
      state.stacks--;

      if (state.stacks <= 0) {
        return delete store[effect.key];
      }
    }
  }

  if ('removeTimer' in state) {
    state.removeTimer -= elapsed;
    if (state.removeTimer <= 0) {
      return delete store[effect.key];
    }
  }

  if ('useCooldown' in state) {
    state.useCooldown -= elapsed;
    if (state.useCooldown <= 0) {
      delete state.useCooldown;
    }
  }

  if ('buffCooldown' in state) {
    state.buffCooldown -= elapsed;
    if (state.buffCooldown <= 0) {
      delete state.buffCooldown;
    }
  }

  if ('rampingTimer' in state) {
    const { rampingInterval, maxStacks } = effect;
    state.rampingTimer -= elapsed;

    while (state.rampingTimer <= 0) {
      if (state.stacks >= maxStacks) {
        delete state.rampingTimer;
        break;
      }

      state.stacks++;
      state.rampingTimer += rampingInterval;
    }
  }
}

function advanceState(ctx, elapsed, state, storeOwnerId) {
  const { effect } = state;
  let hasInterval = false;
  for (const use of effect.use ?? []) {
    if (use.when === 'interval') {
      hasInterval = true;
      break;
    }
  }

  if (!hasInterval) {
    advanceEffectState(state, elapsed);
    return;
  }

  let remaining = elapsed;

  while (remaining) {
    const diff = Math.min(state.useCooldown ?? 0, remaining);
    if (advanceEffectState(state, diff)) break;
    remaining -= diff;
    if (state.useCooldown) continue;

    const runtimeOffset = elapsed - remaining;
    const filterSpec = { fieldId: storeOwnerId ?? effect.ownerId };

    for (const [index, use] of effect.use.entries()) {
      if (use.when !== 'interval') continue;
      if (!ctx.eventFilter(use.filter, effect, filterSpec)) continue;

      const spec = { runtimeOffset };
      if (effect.snapshotBuffs) {
        spec.snapshotBuffs = state.snapshotBuffs[index];
      }

      const removed = runUseEffect(ctx, state, use, spec);

      if (use.commands) {
        runCommands(ctx, effect, use.commands);
      }

      if (removed) {
        remaining = 0;
        break;
      }
    }

    if (remaining && !state.useCooldown) {
      break;
    }
  }
}

function advanceStore(ctx, elapsed, store, storeOwnerId) {
  for (const effectKey in store) {
    const state = store[effectKey];
    advanceState(ctx, elapsed, state, storeOwnerId);
  }
}

export function advanceEffects(ctx, elapsed) {
  const { globalEffects, memberEffects } = ctx.states;

  advanceStore(ctx, elapsed, globalEffects);

  for (const memberId in memberEffects) {
    const store = memberEffects[memberId];
    advanceStore(ctx, elapsed, store, memberId);
  }
}
