import {
  runRemoveEffect,
  runApplyEffect,
} from './effects';

function doRemove(ctx, toRemove = {}) {
  const { memberEffects, globalEffects } = ctx.states;

  for (const [id, stacks] of Object.entries(toRemove)) {
    const effect = ctx.cache.effects[id];

    for (const target of effect.applyTo) {
      if (target === 'global') {
        runRemoveEffect(globalEffects[id], stacks);
      } else {
        runRemoveEffect(memberEffects[target][id], stacks);
      }
    }
  }
}

function doApply(ctx, toApply = {}, doApplyType = 'refresh', doApplyDuration) {
  for (const [effectId, stacks] of Object.entries(toApply)) {
    const effect = ctx.cache.effects[effectId];
    const spec = { stacks, ...(doApplyDuration && { type: doApplyType, duration: doApplyDuration }) };

    runApplyEffect(ctx, effect, spec);
  }
}

export function onRemoveDoCommand(ctx, effect) {
  if ('onRemoveDoRemove' in effect) doRemove(ctx, effect.onRemoveDoRemove);
  if ('onRemoveDoApply' in effect) doApply(ctx, effect.onRemoveDoApply, effect.doApplyType, effect.doApplyDuration);
}

export function onExtendDoCommand(ctx, effect) {
  if ('onExtendDoRemove' in effect) doRemove(ctx, effect.onExtendDoRemove);
  if ('onExtendDoApply' in effect) doApply(ctx, effect.onExtendDoApply, effect.doApplyDuration);
}

export function onUseDoCommand(ctx, effect) {
  if ('onUseDoRemove' in effect) doRemove(ctx, effect.onUseDoRemove);
  if ('onUseDoApply' in effect) doApply(ctx, effect.onUseDoApply, effect.doApplyDuration);
}

export function onApplyDoCommand(ctx, effect) {
  if ('onApplyDoRemove' in effect) doRemove(ctx, effect.onApplyDoRemove);
  if ('onApplyDoApply' in effect) doApply(ctx, effect.onApplyDoApply, effect.doApplyDuration);
}
