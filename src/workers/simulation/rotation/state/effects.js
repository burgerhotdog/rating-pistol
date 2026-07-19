import { matchApplyFilter, matchRemoveFilter, matchExtendFilter } from '../filter';

const getAllStateMaps = (ctx) => {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;

  return [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
    debuffs,
  ];
};

export function applyEffect(ctx, effect, action = {}) {
  const { cooldowns, memberEffects, fieldEffects, debuffs } = ctx.state;

  function updateState(stateMap) {
    const prevState = stateMap[effect.key] ?? {};
    const prevStacks = prevState.stacks ?? 0;
    stateMap[effect.key] = {
      effect,
      stacks: Math.min(prevStacks + 1, effect.maxStacks ?? 1),
      timeLeft: effect.maxDuration ?? Infinity,
      usesLeft: effect.maxUses ?? Infinity,
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
      removeEffect(ctx, stateMap, effect.key);
    }
  }

  for (const target of effect.applyTo) {
    if (target === 'applier') {
      updateState(memberEffects[action.ownerId]);
    } else if (target === 'enemy') {
      updateState(debuffs);
    } else if (target === 'onField' || target === 'offField') {
      updateState(fieldEffects[target]);
    } else {
      updateState(memberEffects[target]);
    }
  }

  if (effect.applyCooldown) {
    cooldowns[effect.key] = effect.applyCooldown;
  }

}

function applyEffects(ctx, action, when) {
  const toApply = [
    ...ctx.cache.effects.global,
    ...ctx.cache.effects.member[action.ownerId],
  ];

  for (const effect of toApply) {
    if (
      effect.applyWhen !== when ||
      ctx.state.cooldowns[effect.key] ||
      !matchApplyFilter({ effect, action, ctx })
    ) continue;

    if (effect.onApplyDoRemoveEffect) {
      onApplyDoRemoveEffect(ctx, effect.onApplyDoRemoveEffect);
    }
    if (effect.onApplyDoApplyEffect) {
      onApplyDoApplyEffect(ctx, effect.onApplyDoApplyEffect);
    }

    if (effect.stateless) continue;
    applyEffect(ctx, effect, action);
  }
}

function extendEffects(ctx, action, when) {
  for (const stateMap of getAllStateMaps(ctx)) {
    for (const [effectKey, effectState] of Object.entries(stateMap)) {
      const effect = ctx.cache.effects.lookup[effectKey];
      if (
        effect.extendWhen !== when ||
        effect.ownerId !== action.ownerId ||
        !matchExtendFilter({ effect, action, ctx }) ||
        !effectState.extensionsLeft ||
        effectState.extendCooldown
      ) continue;

      effectState.timeLeft += effect.extendDuration;
      effectState.extendCooldown = effect.extendCooldown;
      effectState.extensionsLeft--;
    }
  }
}

function removeEffect(ctx, stateMap, effectKey) {
  const effect = ctx.cache.effects.lookup[effectKey];
  const effectState = stateMap[effectKey];

  if (!effect.removeOffset) {
    delete stateMap[effectKey];
    return;
  }

  effectState.removeTimer ??= effect.removeOffset;
}

function removeEffects(ctx, action, when) {
  for (const stateMap of getAllStateMaps(ctx)) {
    for (const effectKey in stateMap) {
      const effect = ctx.cache.effects.lookup[effectKey];
      if (
        effect.removeWhen !== when ||
        effect.ownerId !== action.ownerId ||
        !matchRemoveFilter({ effect, action, ctx })
      ) continue;

      removeEffect(ctx, stateMap, effectKey);
    }
  }
}

export function runEffectPhase(ctx, action, phase) {
  removeEffects(ctx, action, phase);
  extendEffects(ctx, action, phase);
  applyEffects(ctx, action, phase);
}

export function advanceEffects(ctx, elapsed) {
  for (const stateMap of getAllStateMaps(ctx)) {
    for (const [effectKey, effectState] of Object.entries(stateMap)) {
      if (effectState.cooldown) {
        effectState.cooldown -= elapsed;
        if (effectState.cooldown <= 0) {
          delete effectState.cooldown;
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
          delete stateMap[effectKey];
          continue;
        }
      }

      effectState.timeLeft -= elapsed;
      if (effectState.timeLeft <= 0) {
        delete stateMap[effectKey];
        continue;
      }
    }
  }
}

function onApplyDoRemoveEffect(ctx, effectKey) {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;
  const effect = ctx.cache.effects.lookup[effectKey];

  for (const target of effect.applyTo) {
    if (target === 'enemy') {
      removeEffect(ctx, debuffs, effectKey);
    } else if (target === 'onField' || target === 'offField') {
      removeEffect(ctx, fieldEffects[target], effectKey);
    } else {
      removeEffect(ctx, memberEffects[target], effectKey);
    }
  }
}

function onApplyDoApplyEffect(ctx, effectsToApply) {
  for (const [effectKey, stacks] of Object.entries(effectsToApply)) {
    const effect = ctx.cache.effects.lookup[effectKey];
    for (let i = 0; i < stacks; i++) {
      applyEffect(ctx, effect);
    }
  }
}
