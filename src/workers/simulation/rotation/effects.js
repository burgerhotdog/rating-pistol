import { getEffectStates } from './getEffectStates';

export function runRemoveEffect(state, stacks) {
  if (!state) return;
  const { effect } = state;

  state.stacks -= stacks ?? effect.maxStacks ?? 1;

  if (state.stacks <= 0) {
    const { store, effect: { id } } = state;
    delete store[id];
  }
}

export function runExtendEffect(state) {
  if (!state) return;
  const { effect } = state;

  state.timeLeft += effect.extendDuration;
  state.extendCooldown = effect.extendCooldown;
  state.extensionsLeft--;
}

export function runUseEffect(ctx, state, spec = {}) {
  const { runtimeOffset } = spec;
  const { store, effect } = state;
  const runOptions = { runtimeOffset, noDuration: true };

  if (effect.useAction) {
    state.isRunning = true;
    for (let i = 0; i < (effect.times ?? 1); i++) {
      for (const action of effect.useAction) {
        ctx.runAction(ctx, action, runOptions);
      }
    }
    delete state.isRunning;

    if (effect.useCooldown) state.useCooldown = effect.useCooldown;
    if (state.usesLeft) {
      state.usesLeft--;
      if (!state.usesLeft) return delete store[effect.id];
    }
  }
}

export function runApplyEffect(ctx, effect, spec = {}) {
  const { applyCooldowns, memberEffects, globalEffects } = ctx.states;
  const { id, maxStacks = 1 } = effect;

  function updateState(store) {
    const prevState = store[id] ?? {};
    const prevStacks = prevState.stacks ?? 0;

    const nextStacks = prevStacks + (spec.stacks ?? 1);

    store[id] = {
      store,
      effect,
      stacks: Math.min(nextStacks, maxStacks),
      ...(effect.maxDuration &&
        { timeLeft: effect.maxDuration }),
      ...(effect.maxUses &&
        { usesLeft: effect.maxUses }),
      ...(effect.maxExtensions &&
        { extensionsLeft: effect.maxExtensions }),
      ...(effect.applyOffset &&
        { useCooldown: effect.applyOffset }),
      ...(effect.rampingInterval &&
        { rampingTimer: effect.rampingOffset ?? 0 }),
    };

    if ( // If effect should be removed when reaching max stacks
      effect.removeWhen === 'maxStacks' &&
      store[id].stacks === maxStacks
    ) {
      if (effect.removeOffset) {
        store[id].removeTimer ??= effect.removeOffset;
      } else {
        delete store[id];
      }
    }
  }

  for (const target of effect.applyTo) {
    if (target === '$applier') updateState(memberEffects[spec.applier]);
    else if (target === 'global') updateState(globalEffects);
    else if (target in memberEffects) updateState(memberEffects[target]);
  }

  if (effect.applyCooldown)
    applyCooldowns[id] = effect.applyCooldown;
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

  if ('extendCooldown' in state) {
    state.extendCooldown -= elapsed;
    if (state.extendCooldown <= 0) delete state.extendCooldown;
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

    if (effect.useWhen !== 'interval') {
      advanceEffectState(ctx, state, elapsed);
      continue;
    }

    let remaining = elapsed;
    while (remaining) {
      const diff = Math.min(state.useCooldown ?? 0, remaining);
      if (advanceEffectState(ctx, state, diff)) break;
      remaining -= diff;
      
      if (!state.useCooldown) {
        if (runUseEffect(ctx, state, { runtimeOffset: elapsed - remaining })) break;
      }
    }
  }
}
