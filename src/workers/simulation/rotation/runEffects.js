import { GI } from '@/data';
import { runCommands } from './commands';
import { runRemoveEffect, runUseEffect, runApplyEffect } from './effects';

function tryEffectRemove(ctx, when, state, eventOwnerId, filterSpec) {
  const { effect } = state;
  if (!effect.remove) return;

  for (const remove of effect.remove) {
    if (remove.when !== when) continue;
    if (!remove.by.includes(eventOwnerId)) continue;
    if (!ctx.eventFilter(remove.filter, effect, filterSpec)) continue;

    const removed = runRemoveEffect(state, remove);

    const commands = remove.commands;
    if (commands) {
      runCommands(ctx, effect, commands, eventOwnerId ?? effect.ownerId);
    }

    if (removed) return;
  }
}

function tryEffectUse(ctx, when, state, eventOwnerId, filterSpec) {
  const { effect } = state;
  if (!effect.use) return;

  for (const use of effect.use) {
    if (use.when !== when) continue;
    if (!use.by.includes(eventOwnerId)) continue;
    if (state.isRunning || state.useCooldown) continue;
    if (!ctx.eventFilter(use.filter, effect, filterSpec)) continue;

    const removed = runUseEffect(ctx, state, use);

    const commands = use.commands;
    if (commands) {
      runCommands(ctx, effect, commands, eventOwnerId ?? effect.ownerId);
    }

    if (removed) return;
  }
}

function tryEffectApply(ctx, when, effect, eventOwnerId, filterSpec) {
  const { states } = ctx;
  const { applyCooldowns } = states;
  if (!effect.apply) return;

  for (const apply of effect.apply) {
    if (apply.when !== when) continue;

    const applier = eventOwnerId ?? effect.ownerId;
    if (!apply.by.includes(applier) || applyCooldowns[effect.key]) continue;

    const applierField = applier === states.onFieldId ? 'onField' : 'offField';
    if (apply.field && apply.field !== applierField) continue;

    const spec = { ...filterSpec, fieldId: applier };
    if (!ctx.eventFilter(apply.filter, effect, spec)) continue;

    const isMaxStacks = runApplyEffect(ctx, effect, apply, { applier, inflict: event.inflict });

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
  const eventOwnerId = event.ownerId;

  const filterSpec = {
    ...(event.reaction ? { reaction: event } : { action: event }),
    fieldId: eventOwnerId,
  };

  Object.values(globalEffects).forEach((state) =>
    tryEffectRemove(ctx, when, state, eventOwnerId, filterSpec)
  );

  for (const memberId in memberEffects) {
    Object.values(memberEffects[memberId]).forEach((state) =>
      tryEffectRemove(ctx, when, state, eventOwnerId, filterSpec)
    );
  }

  Object.values(globalEffects).forEach((state) =>
    tryEffectUse(ctx, when, state, eventOwnerId, filterSpec)
  );

  for (const memberId in memberEffects) {
    Object.values(memberEffects[memberId]).forEach((state) =>
      tryEffectUse(ctx, when, state, eventOwnerId, filterSpec)
    );
  }

  for (const id in cache.member) {
    const memberEffectDefs = cache.member[id].effects;
    for (const effectKey in memberEffectDefs) {
      const effect = memberEffectDefs[effectKey];
      tryEffectApply(ctx, when, effect, eventOwnerId, filterSpec);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      tryEffectApply(ctx, when, effect, eventOwnerId, filterSpec);
    }
  }
}
