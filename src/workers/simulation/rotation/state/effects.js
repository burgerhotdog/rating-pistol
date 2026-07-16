import { onAction, onSkillType, ifField, ifNegativeStatus } from '../../match';
import { inflictNegativeStatuses } from './negativeStatuses';

const matchApplyIf = (effect, action, ctx) => {
  const hasApplyIf =
    'applyIfField' in effect ||
    'applyIfNegativeStatus' in effect

  return !hasApplyIf ||
    ifField(effect.applyIfField, action.ownerId, ctx.onFieldId) ||
    ifNegativeStatus(effect.applyIfNegativeStatus, ctx.state)
};

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

  if (!(action.key in ctx.cache.effect)) return;

  if ('inflict' in action && trigger === 'hit') {
    inflictNegativeStatuses(ctx, action.inflict);
  }

  const triggered = ctx.cache.effect[action.key]
    .filter((effect) => effect.applyWhen === trigger);

  for (const effect of triggered) {
    if (
      cooldowns[effect.key] ||
      !matchApplyIf(effect, action, ctx)
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
  const { memberEffects, fieldEffects } = ctx.state;

  const stateMaps = [
    ...Object.values(memberEffects),
    ...Object.values(fieldEffects),
  ];

  for (const stateMap of stateMaps) {
    for (const [key, { effect }] of Object.entries(stateMap)) {
      if (effect.ownerId !== action.ownerId) continue;

      if (
        onAction(effect.removeOnAction, action) ||
        onSkillType(effect.removeOnSkillType, action) ||
        ifField(effect.removeIfField, action.ownerId, ctx.onFieldId)
      ) {
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
