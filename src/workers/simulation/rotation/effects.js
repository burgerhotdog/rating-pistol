import { getEffectStates } from './getEffectStates';
import { onUseDoCommand } from './commands';

export function runRemoveEffect(state, stacks) {
  if (!state) return;
  const { effect } = state;

  state.stacks -= stacks ?? effect.maxStacks ?? 1;

  if (state.stacks <= 0) {
    const { store, effect: { id } } = state;
    delete store[id];
  }
}

export function runUseEffect(ctx, state, spec = {}) {
  if (!state) return;
  const { runtimeOffset } = spec;
  const { store, effect } = state;
  const runOptions = { runtimeOffset, noDuration: true };

  if (effect.use) {
    if (effect.use.action) {
      const useTimes = effect.use.times ?? 1;
      state.isRunning = true;

      for (let i = 0; i < useTimes; i++) {
        for (const action of effect.use.action) {
          ctx.runAction(ctx, action, runOptions);
        }
      }

      delete state.isRunning;
    }

    if (effect.use.cooldown) state.useCooldown = effect.use.cooldown;
    if (state.usesLeft) {
      state.usesLeft--;
      if (!state.usesLeft) return delete store[effect.id];
    }
  }
}

export function runApplyEffect(ctx, effect, spec = {}) {
  const { applyCooldowns, memberEffects, globalEffects } = ctx.states;
  const { id, maxStacks = 1 } = effect;
  const isExt = spec.type === 'extend';
  const isDurationExt = isExt && spec.duration;
  const isUsesExt = isExt && spec.uses;

  function updateState(store) {
    const prevState = store[id] ?? {};
    const prevStacks = prevState.stacks ?? 0;

    const nextStacks = prevStacks + (spec.stacks ?? effect?.apply?.stacks ?? 1);

    if (isExt && !prevState.extensionsLeft) return;

    store[id] = {
      store,
      effect,
      stacks: Math.min(nextStacks, maxStacks),
      ...(effect.apply?.duration &&
        { timeLeft: isDurationExt
          ? prevState.timeLeft + spec.duration
          : effect.apply.duration }),
      ...(effect.apply?.uses &&
        { usesLeft: isUsesExt
          ? prevState.usesLeft + spec.uses
          : effect.apply.uses }),
      ...(effect.maxExtensions &&
        { extensionsLeft: isExt
          ? prevState.extensionsLeft - 1
          : effect.maxExtensions }),
      ...(effect.apply?.offset &&
        { useCooldown: isExt
          ? prevState.useCooldown
          : effect.apply.offset }),
      ...(effect.rampingInterval &&
        { rampingTimer: isExt
          ? prevState.rampingTimer
          : effect.rampingOffset ?? 0 }),
    };

    if ( // If effect should be removed when reaching max stacks
      effect.remove?.when === 'maxStacks' &&
      store[id].stacks === maxStacks
    ) {
      if (effect.remove?.offset) {
        store[id].removeTimer ??= effect.remove.offset;
      } else {
        delete store[id];
      }
    }
  }

  for (const target of effect.stores) {
    if (target === '$applier') updateState(memberEffects[spec.applier]);
    else if (target === 'global') updateState(globalEffects);
    else if (target in memberEffects) updateState(memberEffects[target]);
  }

  if (effect.apply?.cooldown)
    applyCooldowns[id] = effect.apply.cooldown;
}

function advanceEffectState(ctx, state, elapsed) {
  const { store, effect } = state;

  if ('timeLeft' in state) {
    state.timeLeft -= elapsed;
    if (state.timeLeft <= 0) return delete store[effect.id];
  }

  if ('removeTimer' in state) {
    state.removeTimer -= elapsed;
    if (state.removeTimer <= 0) return delete store[effect.id];
  }

  if ('useCooldown' in state) {
    state.useCooldown -= elapsed;
    if (state.useCooldown <= 0) delete state.useCooldown;
  }

  if ('buffCooldown' in state) {
    state.buffCooldown -= elapsed;
    if (state.buffCooldown <= 0) delete state.buffCooldown;
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

    if (effect.use?.when !== 'interval') {
      advanceEffectState(ctx, state, elapsed);
      continue;
    }

    let remaining = elapsed;
    while (remaining) {
      const diff = Math.min(state.useCooldown ?? 0, remaining);
      if (advanceEffectState(ctx, state, diff)) break;
      remaining -= diff;

      if (!state.useCooldown) {
        onUseDoCommand(ctx, effect, effect.ownerId);
        if (runUseEffect(ctx, state, { runtimeOffset: elapsed - remaining })) break;
      }
    }
  }
}
