import { getEffectStates } from './getEffectStates';
import { runCommands } from './commands';
import { runUseEffect } from './effects';

function advanceEffectState(ctx, state, elapsed) {
  const { store, effect } = state;

  if ('timeLeft' in state) {
    state.timeLeft -= elapsed;

    if (!effect.decay) {
      if (state.timeLeft <= 0) {
        return delete store[effect.key];
      }
    }

    while (state.timeLeft <= 0) {
      state.timeLeft += effect.apply.duration;
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

export function advanceEffects(ctx, elapsed) {
  if (!elapsed) return;

  for (const state of getEffectStates(ctx, { member: 'all' })) {
    const { effect } = state;
    const uses = effect.use;

    if (!uses) {
      advanceEffectState(ctx, state, elapsed);
      continue;
    }

    let hasInterval = false;
    for (const use of uses) {
      if (use.when === 'interval') {
        hasInterval = true;
        break;
      }
    }

    if (!hasInterval) {
      advanceEffectState(ctx, state, elapsed);
      continue;
    }

    let remaining = elapsed;

    while (remaining) {
      const diff = Math.min(state.useCooldown ?? 0, remaining);

      if (advanceEffectState(ctx, state, diff)) break;
      remaining -= diff;

      if (!state.useCooldown) {
        const runtimeOffset = elapsed - remaining;

        for (const use of uses) {
          if (use.when !== 'interval') continue;

          if (runUseEffect(ctx, state, use, { runtimeOffset })) {
            remaining = 0;
            break;
          }

          if (use.commands) {
            runCommands(ctx, effect, use.commands);
          }
        }

        if (!state.useCooldown) break;
      }
    }
  }
}