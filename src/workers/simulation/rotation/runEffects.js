import { GI } from '@/data';
import {
  onRemoveDoCommand,
  onUseDoCommand,
  onApplyDoCommand,
} from './commands';
import {
  runRemoveEffect,
  runUseEffect,
  runApplyEffect,
} from './effects';

export function runEffects(ctx, when, event) {
  const { cache, states } = ctx;
  const { gameId } = cache;
  const { globalEffects, memberEffects, applyCooldowns } = states;
  const eventOwnerId = event?.ownerId;

  function tryRemove(state) {
    const { effect } = state;
    const { remove } = effect;

    if (remove?.when !== when) return;
    if (!remove.by.includes(eventOwnerId)) return;

    const spec = {
      ...(event.reaction ? { reaction: event } : { action: event }),
      fieldId: eventOwnerId,
    };
    if (!ctx.eventFilter(remove.filter, effect, spec)) return;

    onRemoveDoCommand(ctx, effect, eventOwnerId ?? effect.ownerId);

    if (remove.offset) {
      state.removeTimer ??= remove.offset;
      return;
    }

    runRemoveEffect(state);
  }

  function tryUse(state) {
    const { effect } = state;
    const { use } = effect;

    if (use?.when !== when) return;
    if (!use.by.includes(eventOwnerId)) return;
    if (state.isRunning || state.useCooldown) return;

    const spec = {
      ...(event.reaction ? { reaction: event } : { action: event }),
      fieldId: eventOwnerId,
    };
    if (!ctx.eventFilter(use.filter, effect, spec)) return;

    onUseDoCommand(ctx, effect, eventOwnerId ?? effect.ownerId);
    runUseEffect(ctx, state);
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
    const { apply } = effect;
    if (apply?.when !== when) return;

    const applier = eventOwnerId ?? effect.ownerId;
    if (!apply.by.includes(applier) || applyCooldowns[effect.key]) return;

    if (
      apply.field &&
      apply.field !== (applier === states.onFieldId ? 'onField' : 'offField')
    ) return;

    const spec = {
      ...(event.reaction ? { reaction: event } : { action: event }),
      fieldId: applier,
    };
    if (!ctx.eventFilter(apply.filter, effect, spec)) return;

    onApplyDoCommand(ctx, effect, applier);
    runApplyEffect(ctx, effect, { applier, inflict: event?.inflict });
  }

  for (const memberId in cache.member) {
    const mCache = cache.member[memberId];

    for (const effectKey in mCache.effects) {
      const effect = mCache.effects[effectKey];
      tryApply(effect);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      tryApply(effect);
    }
  }
}
