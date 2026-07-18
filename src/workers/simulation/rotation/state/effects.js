import { matchApplyFilter, matchRemoveFilter } from '../filter';

export function applyEffect(ctx, effect, action = {}) {
  const { cooldowns, memberEffects, fieldEffects, debuffs } = ctx.state;

  function apply(stateMap) {
    const prev = stateMap[effect.key] ?? {};
    const prevStacks = prev.stacks ?? 0;

    const next = {
      stacks: Math.min(prevStacks + 1, effect.maxStacks ?? 1),
      timeRemaining: effect.duration ?? Infinity,
      usesRemaining: effect.maxUses ?? Infinity,
      effect,
    };

    if (effect.intervalCooldown) {
      next.intervalTimer = effect.intervalOffset ?? 0;
    }

    stateMap[effect.key] = next;
  }

  for (const target of effect.applyTo) {
    if (target === 'applier') {
      apply(memberEffects[action.ownerId]);
    } else if (target === 'enemy') {
      apply(debuffs);
    } else if (target === 'onField' || target === 'offField') {
      apply(fieldEffects[target]);
    } else {
      apply(memberEffects[target]);
    }
  }

  if (effect.applyCooldown) {
    cooldowns[effect.key] = effect.applyCooldown;
  }
}

export function applyEffects(ctx, action, applyWhen) {
  const { cooldowns } = ctx.state;

  const toApply = [
    ...ctx.cache.effects.global,
    ...ctx.cache.effects.member[action.ownerId],
  ];

  for (const effect of toApply) {
    if (
      effect.applyWhen !== applyWhen ||
      cooldowns[effect.key] ||
      !matchApplyFilter({ effect, action, ctx })
    ) continue;

    if (effect.applyEffect) { // Apply a different effect instead
      for (const [subKey, stacks] of Object.entries(effect.applyEffect)) {
        // if (cooldowns[subKey]) continue;
        const linkedEffect = toApply.find((effect) => effect.key === subKey);
        for (let i = 0; i < stacks; i++) {
          applyEffect(ctx, linkedEffect, action);
        }
      }
      continue;
    }

    applyEffect(ctx, effect, action);
  }
}

export function applyPassives(ctx) {
  for (const effect of ctx.cache.effects.passive) {
    applyEffect(ctx, effect);
  }
}

export function removeEffects(ctx, action, removeWhen) {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;

  const stateMaps = [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
    debuffs,
  ];

  for (const stateMap of stateMaps) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      const { effect } = effectState;
      if (
        effect.removeWhen !== removeWhen ||
        effect.ownerId !== action.ownerId ||
        !matchRemoveFilter({ effect, action, ctx })
      ) continue;

      if (effect.removeOffset) {
        if (!('removeTimer' in effectState)) {
          effectState.removeTimer = effect.removeOffset;
        }
        continue;
      }

      delete stateMap[key];
    }
  }
}

export function advanceEffects(ctx, elapsed) {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;

  const stateMaps = [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
    debuffs,
  ];

  for (const stateMap of stateMaps) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      if (effectState.cooldown) {
        effectState.cooldown -= elapsed;
        if (effectState.cooldown <= 0) {
          delete effectState.cooldown;
        }
      }

      if (effectState.removeTimer) {
        effectState.removeTimer -= elapsed;
        if (effectState.removeTimer <= 0) {
          delete stateMap[key];
          continue;
        }
      }

      effectState.timeRemaining -= elapsed;
      if (effectState.timeRemaining <= 0) {
        delete stateMap[key];
        continue;
      }
    }
  }
}
