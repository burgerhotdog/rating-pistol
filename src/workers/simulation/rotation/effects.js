export function runRemoveEffect(effectState) {
  if (!effectState) return true;
  const { stateMap, effect } = effectState;

  if ('removeOffset' in effect) {
    effectState.removeTimer ??= effect.removeOffset;
    return false;
  } else {
    delete stateMap[effect.key];
    return true;
  }
}

export function runExtendEffect(effectState) {
  if (!effectState) return;
  const { effect } = effectState;

  effectState.timeLeft += effect.extendDuration;
  effectState.extendCooldown = effect.extendCooldown;
  effectState.extensionsLeft--;
}

export function runUseEffect(effectState, ctx) {
  const { stateMap, effect } = effectState;

  if (effect.useAction) {
    effectState.isRunning = true;
    for (let i = 0; i < (effect.times ?? 1); i++) {
      for (const effectAction of effect.useAction) {
        ctx.runAction(ctx, effectAction);
      }
    }
    delete effectState.isRunning;

    if (effect.useCooldown) {
      effectState.useCooldown = effect.useCooldown;
    }

    if (effectState.usesLeft) {
      effectState.usesLeft--;
      if (!effectState.usesLeft) {
        delete stateMap[effect.key];
      }
    }
  }
}

export function runApplyEffect(ctx, effect, action = {}) {
  const { applyCooldowns, memberEffects, fieldEffects, enemyEffects } = ctx.state;

  function updateState(stateMap) {
    const prevState = stateMap[effect.key] ?? {};
    const prevStacks = prevState.stacks ?? 0;
    stateMap[effect.key] = {
      stateMap,
      effect,
      stacks: Math.min(prevStacks + 1, effect.maxStacks ?? 1),
      ...('maxDuration' in effect &&
        { timeLeft: effect.maxDuration }),
      ...('maxUses' in effect &&
        { usesLeft: effect.maxUses }),
      ...('maxExtensions' in effect &&
        { extensionsLeft: effect.maxExtensions }),
      ...('intervalCooldown' in effect &&
        { intervalTimer: effect.intervalOffset ?? 0 }),
      ...('rampingInterval' in effect &&
        { rampingTimer: effect.rampingOffset ?? 0 }),
    };

    if ( // If effect should be removed when reaching max stacks
      effect.removeWhen === 'maxStacks' &&
      stateMap[effect.key].stacks === (effect.maxStacks ?? 1)
    ) {
      runRemoveEffect(ctx, stateMap, effect.key);
    }
  }

  for (const target of effect.applyTo) {
    if (target === 'applier') {
      updateState(memberEffects[action.ownerId]);
    } else if (target === 'enemy') {
      updateState(enemyEffects);
    } else if (target === 'onField' || target === 'offField') {
      updateState(fieldEffects[target]);
    } else {
      updateState(memberEffects[target]);
    }
  }

  if (effect.applyCooldown) {
    applyCooldowns[effect.key] = effect.applyCooldown;
  }
}

export function advanceEffects(ctx, elapsed) {
  const { memberEffects, fieldEffects, enemyEffects } = ctx.state;
  const effectStates = [
    ...Object.values(memberEffects)
      .flatMap((stateMap) => Object.values(stateMap)),
    ...Object.values(fieldEffects)
      .flatMap((stateMap) => Object.values(stateMap)),
    ...Object.values(enemyEffects),
  ];
  
  for (const effectState of effectStates) {
    const { stateMap, effect } = effectState;

    if (effectState.useCooldown) {
      effectState.useCooldown -= elapsed;
      if (effectState.useCooldown <= 0) {
        delete effectState.useCooldown;
      }
    }

    if (effectState.extendCooldown) {
      effectState.extendCooldown -= elapsed;
      if (effectState.extendCooldown <= 0) {
        delete effectState.extendCooldown;
      }
    }

    if (effectState.rampingTimer) {
      const { rampingInterval, maxStacks } = effectState.effect;
      effectState.rampingTimer -= elapsed;
      while (effectState.rampingTimer <= 0) {
        if (effectState.stacks >= maxStacks) {
          delete effectState.rampingTimer;
          break;
        }
        effectState.stacks++;
        effectState.rampingTimer += rampingInterval;
      }
    }

    if (effectState.removeTimer) {
      effectState.removeTimer -= elapsed;
      if (effectState.removeTimer <= 0) {
        delete stateMap[effect.key];
        continue;
      }
    }

    if (effectState.timeLeft) {
      effectState.timeLeft -= elapsed;
      if (effectState.timeLeft <= 0) {
        delete stateMap[effect.key];
        continue;
      }
    }
  }
}
