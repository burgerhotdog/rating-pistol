import { runCommands } from './commands';
import { getBuffMap } from './getStatMap';

export function runRemoveEffect(state, remove = {}) {
  const { store, effect } = state;

  if (remove.offset) {
    state.removeTimer ??= remove.offset;
    return false;
  }

  state.stacks -= remove.stacks ?? state.stacks;
  if (state.stacks <= 0) {
    delete store[effect.key];
    return true;
  }
}

export function runUseEffect(ctx, state, use = {}, spec = {}) {
  const { store, effect, stacks } = state;

  if (use.action) {
    const useTimes = (use.times ?? 1) * stacks;
    state.isRunning = true;

    for (const [index, action] of use.action.entries()) {
      const runOptions = {
        runtimeOffset: spec.runtimeOffset,
        noDuration: true,
      };

      if (effect.snapshotBuffs) {
        runOptions.snapshotBuffs = spec.snapshotBuffs[index];
      }

      for (let i = 0; i < useTimes; i++) {
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
      delete store[effect.key];
      return true;
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
      state.usesLeft ??= 0;

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

    if (effect.snapshotBuffs) {
      state.snapshotBuffs = effect.use.map((use) =>
        use.action.map((action) =>
          getBuffMap(ctx, { memberId: effect.ownerId, action })
        )
      );
    }

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

    // return state.stacks === maxStacks;

    // If effect should be removed when reaching max stacks
    if (state.stacks === maxStacks) {
      if (effect.remove) {
        for (const remove of effect.remove) {
          if (remove.when !== 'maxStacks') continue;

          const wasRemoved = runRemoveEffect(state, remove);

          if (remove.commands) {
            runCommands(ctx, effect, remove.commands);
          }

          if (wasRemoved) {
            break;
          }
        }
      }
    }
  }

  for (const target of effect.stores) {
    if (target === 'global') {
      updateState(globalEffects);
    } else if (target === '$applier') {
      updateState(memberEffects[spec.applier]);
    } else if (target in memberEffects) {
      updateState(memberEffects[target]);
    }
  }

  if (apply.cooldown) {
    applyCooldowns[effect.key] = apply.cooldown;
  }
}
