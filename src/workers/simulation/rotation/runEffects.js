import { GI } from '@/data';
import { runCommands } from './commands';
import { runRemoveEffect, runUseEffect, runApplyEffect } from './effects';

function tryRemove(ctx, when, state, spec) {
  const { effect } = state;
  if (!effect.remove) return;
  const eventOwnerId = spec.fieldId;

  for (const remove of effect.remove) {
    if (remove.when !== when) continue;
    if (!remove.by.includes(eventOwnerId)) continue;
    if (!ctx.eventFilter(remove.filter, effect, spec)) continue;

    const removed = runRemoveEffect(state, remove);

    const commands = remove.commands;
    if (commands) {
      runCommands(ctx, effect, commands, eventOwnerId ?? effect.ownerId);
    }

    if (removed) return;
  }
}

function tryUse(ctx, when, state, spec) {
  const { effect } = state;
  if (!effect.use) return;
  const eventOwnerId = spec.fieldId;

  for (const use of effect.use) {
    if (use.when !== when) continue;
    if (!use.by.includes(eventOwnerId)) continue;
    if (state.isRunning || state.useCooldown) continue;
    if (!ctx.eventFilter(use.filter, effect, spec)) continue;

    const removed = runUseEffect(ctx, state, use);

    const commands = use.commands;
    if (commands) {
      runCommands(ctx, effect, commands, eventOwnerId ?? effect.ownerId);
    }

    if (removed) return;
  }
}

function tryApply(ctx, when, effect, spec) {
  const { states } = ctx;
  const { applyCooldowns } = states;
  if (!effect.apply) return;
  const eventOwnerId = spec.fieldId;

  for (const apply of effect.apply) {
    if (apply.when !== when) continue;

    const applier = eventOwnerId ?? effect.ownerId;
    if (!apply.by.includes(applier) || applyCooldowns[effect.key]) continue;

    const applierField = applier === states.onFieldId ? 'onField' : 'offField';
    if (apply.field && apply.field !== applierField) continue;

    if (!ctx.eventFilter(apply.filter, effect, { ...spec, fieldId: applier })) continue;

    const isMaxStacks = runApplyEffect(ctx, effect, apply, { applier, inflict: spec.action?.inflict });

    const commands = apply.commands;
    if (commands) {
      runCommands(ctx, effect, commands, applier);
    }

    if (!isMaxStacks) continue;
    if (!effect.remove) continue;
    for (const remove of effect.remove) {
      if (remove.when !== 'maxStacks') continue;
    }
  }
}

export function runEffects(ctx, when, event = {}) {
  const { cache, states } = ctx;
  const { gameId } = cache;
  const { globalEffects, memberEffects } = states;

  const spec = {
    ...(event.reaction ? { reaction: event } : { action: event }),
    fieldId: event.ownerId,
  };

  Object.values(globalEffects).forEach((state) =>
    tryRemove(ctx, when, state, spec)
  );

  for (const memberId in memberEffects) {
    Object.values(memberEffects[memberId]).forEach((state) =>
      tryRemove(ctx, when, state, spec)
    );
  }

  Object.values(globalEffects).forEach((state) =>
    tryUse(ctx, when, state, spec)
  );

  for (const memberId in memberEffects) {
    Object.values(memberEffects[memberId]).forEach((state) =>
      tryUse(ctx, when, state, spec)
    );
  }

  for (const id in cache.member) {
    const memberEffectDefs = cache.member[id].effects;
    for (const effectKey in memberEffectDefs) {
      const effect = memberEffectDefs[effectKey];
      tryApply(ctx, when, effect, spec);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      tryApply(ctx, when, effect, spec);
    }
  }
}
