import { matchRemoveOn, matchRemoveIf } from '../../match';

export function applyEffect(stateMap, effect) {
  const prev = stateMap[effect.key] ?? {};
  const prevStacks = prev.stacks ?? 0;

  const next = {
    stacks: Math.min(prevStacks + 1, effect.maxStacks),
    timeRemaining: effect.duration,
    usesRemaining: effect.maxUses,
    effect,
  };

  if ('intervalCooldown' in effect) {
    next.intervalTimer = effect.intervalOffset ?? 0;
  }

  stateMap[effect.key] = next;
}

export function removeEffects(ctx, action) {
  const { memberEffects, fieldEffects } = ctx.state;

  const stateMaps = [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
  ];

  for (const stateMap of stateMaps) {
    for (const [key, { effect }] of Object.entries(stateMap)) {
      if (effect.ownerId !== action.ownerId) continue;

      if (matchRemoveOn(action, effect) || matchRemoveIf(action, effect, ctx)) {
        delete stateMap[key];
      }
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
      if ('cooldown' in effectState) {
        effectState.cooldown -= elapsed;
        if (effectState.cooldown <= 0) {
          delete effectState.cooldown;
        }
      }

      effectState.timeRemaining -= elapsed;
      if (effectState.timeRemaining <= 0) {
        delete stateMap[key];
      }
    }
  }
}
