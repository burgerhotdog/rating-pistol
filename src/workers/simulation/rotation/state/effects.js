import { matchRemoveFilter } from '../../filter';
import { matchApplyFilter } from '../../filter';
import { inflictNegativeStatuses } from './negativeStatuses';

export function applyEffect(stateMap, effect) {
  const prev = stateMap[effect.key] ?? {};
  const prevStacks = prev.stacks ?? 0;

  const next = {
    stacks: Math.min(prevStacks + 1, effect.maxStacks ?? 1),
    timeRemaining: effect.duration ?? Infinity,
    usesRemaining: effect.maxUses ?? Infinity,
    effect,
  };

  if ('intervalCooldown' in effect) {
    next.intervalTimer = effect.intervalOffset ?? 0;
  }

  stateMap[effect.key] = next;
}

export function applyEffects(ctx, action, trigger) {
  const { cooldowns, memberEffects, fieldEffects, debuffs } = ctx.state;

  if ('inflict' in action && trigger === 'hit') {
    inflictNegativeStatuses(ctx, action.inflict);
  }

  const toTest = [
    ...ctx.cache.appliedByTeam,
    ...ctx.cache.member[action.ownerId].appliedBySelf,
  ].filter((effect) => effect.applyWhen === trigger);

  for (const effect of toTest) {
    if (
      cooldowns[effect.key] ||
      !matchApplyFilter({ effect, action, ctx })
    ) continue;

    for (const target of effect.applyTo) {
      if (target === 'applier') {
        applyEffect(memberEffects[action.ownerId], effect);
      } else if (target in ctx.cache.member) {
        applyEffect(memberEffects[target], effect);
      } else if (target === 'onField' || target === 'offField') {
        applyEffect(fieldEffects[target], effect);
      } else {
        if ('statMap' in effect) {
          applyEffect(debuffs, effect);
        }
      }
    }

    if ('applyCooldown' in effect) {
      cooldowns[effect.key] = effect.applyCooldown;
    }
  }
}

export function applyPassives(ctx, passives) {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;

  for (const passive of passives) {
    for (const target of passive.applyTo) {
      if (target === 'enemy') {
        if ('statMap' in passive) {
          applyEffect(debuffs, passive);
        }
      } else if (target === 'onField' || target === 'offField') {
        applyEffect(fieldEffects[target], passive);
      } else {
        applyEffect(memberEffects[target], passive);
      }
    }
  }
}

export function removeEffects(ctx, action) {
  const { memberEffects, fieldEffects, debuffs } = ctx.state;

  const stateMaps = [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
    debuffs,
  ];

  for (const stateMap of stateMaps) {
    for (const [key, { effect }] of Object.entries(stateMap)) {
      if (effect.ownerId !== action.ownerId) continue;

      if (matchRemoveFilter({ effect, action, ctx })) {
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
