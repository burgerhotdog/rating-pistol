import { runCommands } from './commands';
import { runUseEffect } from './runUseEffect';

function expireEffectState(ctx, state, storeOwnerId) {
  const { store, effect } = state;
  const { expire } = effect;

  delete store[effect.key];

  if (!expire) return;

  const filterSpec = { fieldId: storeOwnerId ?? effect.ownerId };
  if (ctx.eventFilter(expire.filter, effect, filterSpec)) {
    runCommands(ctx, effect, expire.commands);
  };
}

function advanceEffectState(ctx, state, elapsed, storeOwnerId, deferExpiration = false) {
  const { effect } = state;
  let pending = false;

  const expire = (timeLeft) => {
    if (deferExpiration && timeLeft === 0) {
      pending = true;
      return false;
    }

    expireEffectState(ctx, state, storeOwnerId);
    return true;
  };

  if (effect.independentStacks) {
    const lastTime = state.independentStacks.at(-1);

    for (let i = 0; i < state.independentStacks.length; i++) {
      state.independentStacks[i] = Math.max(state.independentStacks[i] - elapsed, 0);
    }

    while (state.independentStacks[0] === 0) {
      state.stacks--;
      state.independentStacks.shift();
    }

    if (!state.independentStacks.length) {
      if (expire(lastTime - elapsed)) return 'expired';
    }
  }

  if (state.timeLeft > 0) {
    state.timeLeft -= elapsed;

    if (!effect.decay) {
      if (state.timeLeft <= 0) {
        if (expire(state.timeLeft)) return 'expired';
      }
    } else {
      while (state.timeLeft <= 0) {
        const timeLeft = state.timeLeft;

        state.timeLeft += effect.decayDuration;
        state.stacks--;

        if (state.stacks <= 0) {
          if (expire(timeLeft)) return 'expired';
          break;
        }
      }
    }
  }

  if ('removeTimer' in state) {
    state.removeTimer -= elapsed;

    if (state.removeTimer <= 0) {
      if (expire(state.removeTimer)) return 'expired';
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

  if (pending) return 'pending';
}

function advanceState(ctx, elapsed, state, storeOwnerId) {
  const { effect } = state;

  const hasInterval = effect.use?.some((use) => use.when === 'interval');

  if (!hasInterval) {
    advanceEffectState(ctx, state, elapsed, storeOwnerId);
    return;
  }

  let remaining = elapsed;

  while (remaining) {
    const cooldown = state.useCooldown ?? 0;
    const diff = Math.min(cooldown, remaining);

    const status = advanceEffectState(ctx, state, diff, storeOwnerId, diff === cooldown);
    if (status === 'expired') break;

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

    if (status === 'pending') {
      const stillExpired =
        (effect.independentStacks && !state.independentStacks.length) ||
        (!effect.decay && state.timeLeft === 0) ||
        (effect.decay && state.stacks <= 0) ||
        ('removeTimer' in state && state.removeTimer <= 0);

      if (state.store[effect.key] === state && stillExpired) {
        expireEffectState(ctx, state, storeOwnerId);
      }

      break;
    }

    if (remaining && !state.useCooldown) {
      advanceEffectState(ctx, state, remaining, storeOwnerId);
      break;
    }
  }
}

function advanceStore(ctx, elapsed, store, storeOwnerId) {
  for (const [effectKey, state] of Object.entries(store)) {
    if (store[effectKey] !== state) continue;

    advanceState(ctx, elapsed, state, storeOwnerId);
  }
}

export function advanceEffects(ctx, elapsed) {
  const { globalEffects, memberEffects } = ctx.states;

  advanceStore(ctx, elapsed, globalEffects);

  for (const memberId in memberEffects) {
    const store = memberEffects[memberId];
    advanceStore(ctx, elapsed, store, Number(memberId));
  }
}
