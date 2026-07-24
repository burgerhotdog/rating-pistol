import { getEffectStates } from './getEffectStates';

export function runRemoveEffect(state) {
  if (!state) return;
  const { store, effect } = state;

  if ('removeOffset' in effect) {
    state.removeTimer ??= effect.removeOffset;
  } else {
    delete store[effect.key];
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

  if ('useAction' in effect) {
    state.isRunning = true;
    for (let i = 0; i < (effect.times ?? 1); i++) {
      for (const action of effect.useAction) {
        ctx.runAction(ctx, action, { runtimeOffset, noDuration: true });
      }
    }
    delete state.isRunning;

    if (effect.useCooldown) state.useCooldown = effect.useCooldown;

    if (state.usesLeft) {
      state.usesLeft--;
      if (!state.usesLeft) return delete store[effect.key];
    }
  }
}

export function runApplyEffect(ctx, effect, action = {}) {
  const { applyCooldowns, memberEffects, globalEffects } = ctx.states;

  function updateState(store) {
    const prevState = store[effect.key] ?? {};
    const prevStacks = prevState.stacks ?? 0;
    store[effect.key] = {
      store,
      effect,
      stacks: Math.min(prevStacks + 1, effect.maxStacks ?? 1),
      ...('maxDuration' in effect &&
        { timeLeft: effect.maxDuration }),
      ...('maxUses' in effect &&
        { usesLeft: effect.maxUses }),
      ...('maxExtensions' in effect &&
        { extensionsLeft: effect.maxExtensions }),
      ...('applyOffset' in effect &&
        { useCooldown: effect.applyOffset }),
      ...('rampingInterval' in effect &&
        { rampingTimer: effect.rampingOffset ?? 0 }),
    };

    if ( // If effect should be removed when reaching max stacks
      effect.removeWhen === 'maxStacks' &&
      store[effect.key].stacks === (effect.maxStacks ?? 1)
    ) {
      runRemoveEffect(store[effect.key]);
    }
  }

  for (const target of effect.applyTo) {
    if (target === 'applier') updateState(memberEffects[action.ownerId]);
    else if (target === 'global') updateState(globalEffects);
    else updateState(memberEffects[target]);
  }

  if (effect.applyCooldown) applyCooldowns[effect.key] = effect.applyCooldown;
}

function advanceEffectState(ctx, state, elapsed) {
  const { store, effect } = state;

  if ('timeLeft' in state) {
    state.timeLeft -= elapsed;
    if (state.timeLeft <= 0) return delete store[effect.key];
  }

  if ('removeTimer' in state) {
    state.removeTimer -= elapsed;
    if (state.removeTimer <= 0) return delete store[effect.key];
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
      const diff = Math.min(state.useCooldown, remaining);
      if (advanceEffectState(ctx, state, diff)) break;
      remaining -= diff;
      
      if (!state.useCooldown) {
        if (runUseEffect(ctx, state, { runtimeOffset: elapsed - remaining })) break;
      }
    }
  }
}
