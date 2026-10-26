import { GI } from '@/data';
import { runCommands, runRemoveEffect, runUseEffect, runApplyEffect } from './states';

function checkBy(ctx, effect, by, id) {
  const { memberIds } = ctx.cache;
  const { ownerId } = effect;

  if (by[0] === '$any') return true;

  return by.some((option) => {
    if (option === '$next') {
      const index = memberIds.indexOf(ownerId);
      return memberIds.at(index - 1) === id;
    }

    return option === id;
  });
}

function selectRemove(ctx, when, state, spec) {
  const { effect } = state;
  if (!effect.remove) return;
  const eventOwnerId = spec.fieldId ?? effect.ownerId;

  for (const [index, remove] of effect.remove.entries()) {
    if (remove.when !== when) continue;
    if (!checkBy(ctx, effect, remove.by, eventOwnerId)) continue;
    if (!ctx.eventFilter(remove.filter, effect, spec)) continue;

    return { state, index };
  }
}

function executeRemove(ctx, state, index, fieldId) {
  const { effect } = state;

  const remove = effect.remove[index];

  runRemoveEffect(state, remove);

  if (remove.commands) {
    runCommands(ctx, effect, remove.commands, fieldId ?? effect.ownerId);
  }
}

function selectUse(ctx, when, state, spec) {
  const { effect } = state;
  if (!effect.use) return;
  const eventOwnerId = spec.fieldId;

  for (const [index, use] of effect.use.entries()) {
    if (use.when !== when) continue;
    if (!checkBy(ctx, effect, use.by, eventOwnerId)) continue;
    if (state.isRunning || state.useCooldown) continue;

    const ownerField = effect.ownerId === ctx.states.onFieldId ? 'onField' : 'offField';
    if (use.field && use.field !== ownerField) continue;

    if (!ctx.eventFilter(use.filter, effect, spec)) continue;

    return { state, index };
  }
}

function executeUse(ctx, state, index, fieldId, inflict) {
  const { effect, stacks } = state;

  const use = effect.use[index];

  const useSpec = { inflict };
  if (effect.snapshotBuffs) {
    useSpec.snapshotBuffs = state.snapshotBuffs[index];
  }

  runUseEffect(ctx, state, use, useSpec);

  if (use.commands) {
    for (let i = 0; i < stacks; i++) {
      runCommands(ctx, effect, use.commands, fieldId ?? effect.ownerId);
    }
  }
}

function tryApply(ctx, when, effect, spec) {
  const { states } = ctx;
  const { applyCooldowns } = states;
  if (!effect.apply) return;
  const eventOwnerId = spec.fieldId;

  for (const apply of effect.apply) {
    if (apply.when !== when) continue;
    if (applyCooldowns[effect.key]) continue;

    const applier = eventOwnerId ?? effect.ownerId;
    if (!checkBy(ctx, effect, apply.by, applier)) continue;

    const ownerField = effect.ownerId === states.onFieldId ? 'onField' : 'offField';
    if (apply.field && apply.field !== ownerField) continue;

    if (!ctx.eventFilter(apply.filter, effect, { ...spec, fieldId: applier })) continue;

    runApplyEffect(ctx, effect, apply, { applier, inflict: spec.action?.inflict });

    const commands = apply.commands;
    if (commands) {
      runCommands(ctx, effect, commands, applier);
    }

    break;
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

  const toRemove = [];

  for (const effectKey in globalEffects) {
    const state = globalEffects[effectKey];
    const result = selectRemove(ctx, when, state, spec);

    if (result) {
      toRemove.push({ ...result, fieldId: event.ownerId });
    }
  }

  for (const memberId in memberEffects) {
    const memberStore = memberEffects[memberId];

    for (const effectKey in memberStore) {
      const state = memberStore[effectKey];
      const result = selectRemove(ctx, when, state, {
        ...spec,
        fieldId: event.ownerId ?? Number(memberId),
      });

      if (result) {
        toRemove.push({
          ...result,
          fieldId: event.ownerId ?? Number(memberId),
        });
      }
    }
  }

  for (const { state, index, fieldId } of toRemove) {
    executeRemove(ctx, state, index, fieldId);
  }

  const toUse = [];

  for (const effectKey in globalEffects) {
    const state = globalEffects[effectKey];
    const result = selectUse(ctx, when, state, spec);

    if (result) {
      toUse.push({
        ...result,
        fieldId: event.ownerId,
      });
    }
  }

  for (const memberId in memberEffects) {
    const memberStore = memberEffects[memberId];

    for (const effectKey in memberStore) {
      const state = memberStore[effectKey];
      const result = selectUse(ctx, when, state, {
        ...spec,
        fieldId: event.ownerId ?? Number(memberId),
      });

      if (result) {
        toUse.push({
          ...result,
          fieldId: event.ownerId ?? Number(memberId),
        });
      }
    }
  }

  for (const { state, index, fieldId } of toUse) {
    executeUse(ctx, state, index, fieldId, spec.action?.inflict);
  }

  for (const id in cache.member) {
    const memberEffectDefs = cache.member[id].effects;
    for (const effectKey in memberEffectDefs) {
      const effect = memberEffectDefs[effectKey];
      tryApply(ctx, when, effect, spec);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.teamResonance.effects) {
      tryApply(ctx, when, effect, spec);
    }
  }
}
