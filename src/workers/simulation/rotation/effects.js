import { runCommands } from './commands';
import { getEffectStates } from './getEffectStates';

export function runRemoveEffect(state, remove = {}) {
  const { store, effect } = state;

  if (remove.offset) {
    state.removeTimer ??= remove.offset;
    return;
  }

  state.stacks -= remove.stacks ?? state.stacks;
  if (state.stacks <= 0) {
    delete store[effect.key];
  }
}

export function runUseEffect(ctx, state, use = {}, spec = {}) {
  if (use.action) {
    const useTimes = use.times ?? 1;
    state.isRunning = true;

    const runOptions = {
      runtimeOffset: spec.runtimeOffset,
      noDuration: true,
    };

    for (let i = 0; i < useTimes; i++) {
      for (const action of use.action) {
        ctx.runAction(action, runOptions);
      }
    }

    delete state.isRunning;
  }

  if (use.cooldown) {
    state.useCooldown = use.cooldown;
  }

  if (state.usesLeft) {
    state.usesLeft--;
    if (state.usesLeft <= 0) {
      const { store, effect } = state;
      return delete store[effect.key];
    }
  }
}

export function runApplyEffect(ctx, effect, apply = {}, spec = {}) {
  const { applyCooldowns, memberEffects, globalEffects } = ctx.states;
  const { maxStacks = 1 } = effect;

  function updateState(store) {
    const prev = store[effect.key];
    if (prev && effect.maxExtensions && !prev.extensionsLeft && apply.extend) {
      return;
    }

    const state = store[effect.key] ??= {
      store,
      effect,
      stacks: 0,
      ...(apply.offset && {
        useCooldown: apply.offset,
      }),
      ...(effect.maxExtensions && {
        extensionsLeft: effect.maxExtensions,
      }),
      ...(effect.rampingInterval && {
        rampingTimer: effect.rampingOffset ?? 0,
      }),
    };

    let stackMult = 1;
    if (apply.perStatusInflict) {
      stackMult = spec.inflict?.status?.[apply.perStatusInflict] ?? 0;
    }
    const stacksToApply = (apply.stacks ?? 1) * stackMult;
    state.stacks = Math.min(state.stacks + stacksToApply, maxStacks);

    if (apply.duration) {
      state.timeLeft ??= 0;

      if (apply.extend) {
        state.timeLeft += apply.duration;
      } else {
        state.timeLeft = Math.max(apply.duration, state.timeLeft);
      }
    }

    if (apply.uses) {
      state.applyUses ??= 0;

      if (apply.extend) {
        state.usesLeft += apply.uses;
      } else {
        state.usesLeft = Math.max(apply.uses, state.usesLeft);
      }
    }

    if (effect.maxExtensions) {
      if (apply.extend) {
        state.extensionsLeft--;
      } else {
        state.extensionsLeft = effect.maxExtensions;
      }
    }

    if (apply.offset && !apply.extend) {
      state.useCooldown = apply.offset;
    }

    if (effect.rampingInterval && !apply.extend) {
      state.rampingTimer = effect.rampingOffset ?? 0;
    }

    // If effect should be removed when reaching max stacks
    if (effect.removeWhenMaxStacks && state.stacks === maxStacks) {
      if (effect.removeWhenMaxStacksOffset) {
        state.removeTimer ??= effect.removeWhenMaxStacksOffset;
      } else {
        delete store[effect.key];
      }
    }
    // TODO handle commands

    // If same effect was already applied by another member
    if (!effect.stackable) {
      for (const id in ctx.cache.member) {
        const member = ctx.cache.member[id];
        if (member.id === effect.ownerId) continue;

        const otherEffectId = `${member.id}.${effect.category}`;
        if (otherEffectId in store) {
          delete store[otherEffectId];
        }
      }
    }
  }

  for (const target of effect.stores) {
    if (target === '$applier') updateState(memberEffects[spec.applier]);
    else if (target === 'global') updateState(globalEffects);
    else if (target in memberEffects) updateState(memberEffects[target]);
  }

  if (apply.cooldown) {
    applyCooldowns[effect.key] = apply.cooldown;
  }
}

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
