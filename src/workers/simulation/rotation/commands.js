import {
  runRemoveEffect,
  runUseEffect,
  runApplyEffect,
} from './effects';

function doRemove(ctx, ownerId, toRemove = {}) {
  const { memberEffects, globalEffects } = ctx.states;

  for (const [effectKey, stacks] of Object.entries(toRemove)) {
    const effect = ctx.cache.member[ownerId].effects[effectKey];

    for (const target of effect.stores) {
      if (target === 'global') {
        runRemoveEffect(globalEffects[effectKey], stacks);
      } else {
        runRemoveEffect(memberEffects[target][effectKey], stacks);
      }
    }
  }
}

function doUse(ctx, ownerId, toUse = {}) {
  const { memberEffects, globalEffects } = ctx.states;

  for (const [effectKey, times] of Object.entries(toUse)) {
    const effect = ctx.cache.member[ownerId].effects[effectKey];

    for (const store of effect.stores) {
      if (store === 'global') {
        runUseEffect(ctx, globalEffects[effectKey]);
      } else {
        runUseEffect(ctx, memberEffects[store][effectKey]);
      }
    }
  }
}

function doApply(ctx, ownerId, applier, toApply = {}, doApplyType = 'refresh', doApplyDuration) {
  for (const [effectKey, stacks] of Object.entries(toApply)) {
    const effect = ctx.cache.member[ownerId].effects[effectKey];
    const spec = {
      stacks,
      applier,
      ...(doApplyDuration && {
        type: doApplyType,
        duration: doApplyDuration,
      }),
    };

    runApplyEffect(ctx, effect, spec);
  }
}

export function onRemoveDoCommand(ctx, effect, applier) {
  if ('onRemoveDoRemove' in effect) doRemove(ctx, effect.ownerId, effect.onRemoveDoRemove);
  if ('onRemoveDoUse' in effect) doUse(ctx, effect.ownerId, effect.onRemoveDoUse);
  if ('onRemoveDoApply' in effect) doApply(ctx, effect.ownerId, applier, effect.onRemoveDoApply, effect.doApplyType, effect.doApplyDuration);
}

export function onUseDoCommand(ctx, effect, applier) {
  if ('onUseDoRemove' in effect) doRemove(ctx, effect.ownerId, effect.onUseDoRemove);
  if ('onUseDoUse' in effect) doUse(ctx, effect.ownerId, effect.onUseDoUse);
  if ('onUseDoApply' in effect) doApply(ctx, effect.ownerId, applier, effect.onUseDoApply, effect.doApplyType, effect.doApplyDuration);
}

export function onApplyDoCommand(ctx, effect, applier) {
  if ('onApplyDoRemove' in effect) doRemove(ctx, effect.ownerId, effect.onApplyDoRemove);
  if ('onApplyDoUse' in effect) doUse(ctx, effect.ownerId, effect.onApplyDoUse);
  if ('onApplyDoApply' in effect) doApply(ctx, effect.ownerId, applier, effect.onApplyDoApply, effect.doApplyType, effect.doApplyDuration);
}
