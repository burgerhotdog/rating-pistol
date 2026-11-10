import { GI } from '@/data';
import { runRemoveEffect, runUseEffect, runApplyEffect } from './states';

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

function selectRemove(ctx, when, state, event, storeOwnerId) {
  const { effect } = state;
  if (!effect.remove) return;

  const ownerField = effect.ownerId === ctx.states.onFieldId ? 'onField' : 'offField';

  for (const [index, remove] of effect.remove.entries()) {
    if (remove.when !== when) continue;
    if (!checkBy(ctx, effect, remove.by, event.ownerId ?? event.action?.ownerId ?? storeOwnerId ?? effect.ownerId)) continue;
    if (remove.field && remove.field !== ownerField) continue;
    if (!ctx.eventFilter(remove.filter, effect.ownerId, event, event.ownerId ?? event.action?.ownerId ?? storeOwnerId)) continue;

    return { state, index };
  }
}

function selectUse(ctx, when, state, event, storeOwnerId) {
  const { effect } = state;
  if (!effect.use) return;

  const ownerField = effect.ownerId === ctx.states.onFieldId ? 'onField' : 'offField';

  for (const [index, use] of effect.use.entries()) {
    if (use.when !== when) continue;
    if (!checkBy(ctx, effect, use.by, event.ownerId ?? event.action?.ownerId ?? storeOwnerId)) continue;
    if (state.isRunning || state.useCooldown) continue;
    if (use.field && use.field !== ownerField) continue;
    if (!ctx.eventFilter(use.filter, effect.ownerId, event, event.ownerId ?? event.action?.ownerId ?? storeOwnerId)) continue;

    return { state, index };
  }
}

function scanEffects(ctx, when, event, type) {
  const queue = [];

  for (const effectKey in ctx.states.globalEffects) {
    const state = ctx.states.globalEffects[effectKey];

    const result = type === 'remove'
      ? selectRemove(ctx, when, state, event)
      : selectUse(ctx, when, state, event);

    if (result) {
      queue.push({ ...result, fieldId: event.ownerId ?? event.action?.ownerId });
    }
  }

  for (const memberId in ctx.states.memberEffects) {
    const memberStore = ctx.states.memberEffects[memberId];

    for (const effectKey in memberStore) {
      const state = memberStore[effectKey];

      const result = type === 'remove'
        ? selectRemove(ctx, when, state, event, Number(memberId))
        : selectUse(ctx, when, state, event, Number(memberId));

      if (result) {
        queue.push({ ...result, fieldId: event.ownerId ?? event.action?.ownerId ?? Number(memberId) });
      }
    }
  }

  return queue;
}

function executeRemove(ctx, state, index, fieldId) {
  const { effect } = state;

  const remove = effect.remove[index];

  runRemoveEffect(state, remove);

  if (remove.commands) {
    ctx.runCommands(effect.ownerId, remove.commands, fieldId ?? effect.ownerId);
  }
}

function executeUse(ctx, state, index, fieldId) {
  const { effect, stacks } = state;

  const use = effect.use[index];

  const useSpec = {};
  if (effect.snapshotBuffs) {
    useSpec.snapshotBuffs = state.snapshotBuffs[index];
  }

  runUseEffect(ctx, state, use, useSpec);

  if (use.commands) {
    for (let i = 0; i < Math.round(stacks); i++) {
      ctx.runCommands(effect.ownerId, use.commands, fieldId ?? effect.ownerId);
    }
  }
}

function tryApply(ctx, when, effect, event) {
  const { states } = ctx;
  const { applyCooldowns } = states;
  if (!effect.apply) return;

  for (const apply of effect.apply) {
    if (apply.when !== when) continue;
    if (applyCooldowns[effect.key]) continue;

    const applier = event.ownerId ?? event.action?.ownerId ?? effect.ownerId;
    if (!checkBy(ctx, effect, apply.by, applier)) continue;

    const ownerField = effect.ownerId === states.onFieldId ? 'onField' : 'offField';
    if (apply.field && apply.field !== ownerField) continue;

    if (!ctx.eventFilter(apply.filter, effect.ownerId, event, applier)) continue;

    runApplyEffect(ctx, effect, apply, { applier });

    const commands = apply.commands;
    if (commands) {
      ctx.runCommands(effect.ownerId, commands, applier);
    }

    break;
  }
}

export function runEffects(ctx, when, event = {}) {
  // Handle remove
  const toRemove = scanEffects(ctx, when, event, 'remove');
  for (const { state, index, fieldId } of toRemove) {
    executeRemove(ctx, state, index, fieldId);
  }

  // Handle use
  const toUse = scanEffects(ctx, when, event, 'use');
  for (const { state, index, fieldId } of toUse) {
    executeUse(ctx, state, index, fieldId);
  }

  // Handle apply
  for (const id in ctx.cache.member) {
    const memberEffectDefs = ctx.cache.member[id].effects;
    for (const effectKey in memberEffectDefs) {
      const effect = memberEffectDefs[effectKey];
      tryApply(ctx, when, effect, event);
    }
  }

  if (ctx.cache.gameId === GI) {
    for (const effect of ctx.cache.teamResonance.effects) {
      tryApply(ctx, when, effect, event);
    }
  }
}
