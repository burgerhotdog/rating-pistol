import { toArray } from '@/utils';
import {
  runRemoveEffect,
  runApplyEffect,
} from './effects';

function doRemove(ctx, rawDoRemove) {
  const { memberEffects, globalEffects } = ctx.state;
  const doRemove = toArray(rawDoRemove);

  for (const effectKey of doRemove) {
    const effect = ctx.cache.effects[effectKey];
    for (const target of effect.applyTo) {
      if (target === 'global') {
        runRemoveEffect(globalEffects[effectKey]);
      } else {
        runRemoveEffect(memberEffects[target][effectKey]);
      }
    }
  }
}

function doApply(ctx, effectsToApply) {
  for (const [effectKey, stacks] of Object.entries(effectsToApply)) {
    const effect = ctx.cache.effects[effectKey];
    for (let i = 0; i < stacks; i++) {
      runApplyEffect(ctx, effect);
    }
  }
}

export function onUseDoCommand(ctx, effect) {
  if (effect.onUseDoRemove) {
    doRemove(ctx, effect.onUseDoRemove);
  }
  if (effect.onUseDoApply) {
    doApply(ctx, effect.onUseDoApply);
  }
}

export function onApplyDoCommand(ctx, effect) {
  if (effect.onApplyDoRemove) {
    doRemove(ctx, effect.onApplyDoRemove);
  }
  if (effect.onApplyDoApply) {
    doApply(ctx, effect.onApplyDoApply);
  }
}
