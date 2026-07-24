import { toArray } from '@/utils';
import {
  runRemoveEffect,
  runApplyEffect,
} from './effects';

function doRemove(ctx, toRemove) {
  const { memberEffects, globalEffects } = ctx.states;

  for (const effectKey of toArray(toRemove)) {
    const effect = ctx.cache.effects[effectKey];
    for (const target of effect.applyTo) {
      if (target === 'global') runRemoveEffect(globalEffects[effectKey]);
      else runRemoveEffect(memberEffects[target][effectKey]);
    }
  }
}

function doApply(ctx, toApply = {}) {
  for (const [effectKey, stacks] of Object.entries(toApply)) {
    const effect = ctx.cache.effects[effectKey];
    for (let i = 0; i < stacks; i++) runApplyEffect(ctx, effect);
  }
}

export function onUseDoCommand(ctx, effect) {
  if ('onUseDoRemove' in effect) doRemove(ctx, effect.onUseDoRemove);
  if ('onUseDoApply' in effect) doApply(ctx, effect.onUseDoApply);
}

export function onApplyDoCommand(ctx, effect) {
  if ('onApplyDoRemove' in effect) doRemove(ctx, effect.onApplyDoRemove);
  if ('onApplyDoApply' in effect) doApply(ctx, effect.onApplyDoApply);
}
