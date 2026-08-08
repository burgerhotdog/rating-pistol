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

function doApply(ctx, toApply = {}) {
  for (const [effectId, stacks] of Object.entries(toApply)) {
    const effect = ctx.cache.effects[effectId];

    runApplyEffect(ctx, effect, { stacks });
  }
}

export function onRemoveDoCommand(ctx, effect) {
  if ('onRemoveDoRemove' in effect) doRemove(ctx, effect.onRemoveDoRemove);
  if ('onRemoveDoApply' in effect) doApply(ctx, effect.onRemoveDoApply);
}

export function onExtendDoCommand(ctx, effect) {
  if ('onExtendDoRemove' in effect) doRemove(ctx, effect.onExtendDoRemove);
  if ('onExtendDoApply' in effect) doApply(ctx, effect.onExtendDoApply);
}

export function onUseDoCommand(ctx, effect) {
  if ('onUseDoRemove' in effect) doRemove(ctx, effect.onUseDoRemove);
  if ('onUseDoApply' in effect) doApply(ctx, effect.onUseDoApply);
}

export function onApplyDoCommand(ctx, effect) {
  if ('onApplyDoRemove' in effect) doRemove(ctx, effect.onApplyDoRemove);
  if ('onApplyDoApply' in effect) doApply(ctx, effect.onApplyDoApply);
}
