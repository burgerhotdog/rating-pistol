import { GI } from '@/data';
import { runCommands } from './commands';
import {
  runRemoveEffect,
  runUseEffect,
  runApplyEffect,
} from './effects';

export function runEffects(ctx, when, event = {}) {
  const { cache, states } = ctx;
  const { gameId } = cache;
  const { globalEffects, memberEffects, applyCooldowns } = states;
  const eventOwnerId = event.ownerId;

  function tryRemove(state) {
    const { effect } = state;
    if (!effect.remove) return;

    for (const remove of effect.remove) {
      if (remove.when !== when) continue;
      if (!remove.by.includes(eventOwnerId)) continue;

      const spec = {
        ...(event.reaction ? { reaction: event } : { action: event }),
        fieldId: eventOwnerId,
      };
      if (!ctx.eventFilter(remove.filter, effect, spec)) continue;

      runRemoveEffect(state, remove);

      if (remove.commands) {
        runCommands(ctx, effect, remove.commands, eventOwnerId ?? effect.ownerId);
      }

      return;
    }
  }

  function tryUse(state) {
    const { effect } = state;
    if (!effect.use) return;

    for (const use of effect.use) {
      if (use.when !== when) continue;
      if (!use.by.includes(eventOwnerId)) continue;
      if (state.isRunning || state.useCooldown) continue;

      const spec = {
        ...(event.reaction ? { reaction: event } : { action: event }),
        fieldId: eventOwnerId,
      };
      if (!ctx.eventFilter(use.filter, effect, spec)) continue;

      runUseEffect(ctx, state, use);

      if (use.commands) {
        runCommands(ctx, effect, use.commands, eventOwnerId ?? effect.ownerId);
      }
    }
  }

  Object.values(globalEffects).forEach(tryRemove);
  for (const memberId in memberEffects) {
    Object.values(memberEffects[memberId]).forEach(tryRemove);
  }

  Object.values(globalEffects).forEach(tryUse);
  for (const memberId in memberEffects) {
    Object.values(memberEffects[memberId]).forEach(tryUse);
  }

  function tryApply(effect) {
    if (!effect.apply) return;

    for (const apply of effect.apply) {
      if (apply.when !== when) continue;

      const applier = eventOwnerId ?? effect.ownerId;
      if (!apply.by.includes(applier) || applyCooldowns[effect.key]) continue;

      const applierField = applier === states.onFieldId ? 'onField' : 'offField';
      if (apply.field && apply.field !== applierField) continue;

      const spec = {
        ...(event.reaction ? { reaction: event } : { action: event }),
        fieldId: applier,
      };
      if (!ctx.eventFilter(apply.filter, effect, spec)) continue;

      runApplyEffect(ctx, effect, apply, { applier, inflict: event.inflict });

      if (apply.commands) {
        runCommands(ctx, effect, apply.commands, applier);
      }
    }
  }

  for (const id in cache.member) {
    const memberEffectDefs = cache.member[id].effects;

    for (const effectKey in memberEffectDefs) {
      tryApply(memberEffectDefs[effectKey]);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      tryApply(effect);
    }
  }
}
