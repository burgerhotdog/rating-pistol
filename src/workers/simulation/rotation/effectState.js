import { matchRemoveOn, matchRemoveIf } from '../match';

export const createEffectStateMaps = (memberIds) => {
  const stateMaps = {};

  for (const memberId of memberIds) {
    stateMaps[memberId] = {};
  }

  return stateMaps;
};

export function applyEffect(effectStates, effect, applyTimes) {
  const { intervalOffset } = effect;
  const prev = effectStates[effect.key] ?? {};
  const existingStacks = prev.stacks ?? 0;

  const next = {
    stacks: Math.min(existingStacks + applyTimes, effect.maxStacks),
    timeRemaining: effect.duration,
    usesRemaining: effect.maxUses,
    effect,
  };

  if ('intervalCooldown' in effect) {
    const existingEffectTimer = prev.intervalTimer;
    next.intervalTimer ??= existingEffectTimer ?? intervalOffset;
  }

  effectStates[effect.key] = next;
}

export function removeEffects(ctx, action) {
  const { effects, fieldEffects } = ctx.state;

  const stateMaps = [
    ...Object.values(effects),
    ...Object.values(fieldEffects),
  ];

  for (const stateMap of stateMaps) {
    for (const effectKey in stateMap) {
      const { effect } = stateMap[effectKey];
      if (effect.ownerId !== action.ownerId) continue;

      if (matchRemoveOn(action, effect) || matchRemoveIf(action, effect, ctx)) {
        delete stateMap[effectKey];
      }
    }
  }
}

export function advanceEffects(ctx, elapsed) {
  const { effects, fieldEffects, debuffs } = ctx.state;

  const stateMaps = [
    ...Object.values(effects),
    ...Object.values(fieldEffects),
    debuffs,
  ];

  for (const stateMap of stateMaps) {
    for (const [key, effectState] of Object.entries(stateMap)) {
      effectState.timeRemaining -= elapsed;

      if (effectState.timeRemaining <= 0) {
        delete stateMap[key];
      }
    }
  }
}
