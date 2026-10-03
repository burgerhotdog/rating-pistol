import { runRemoveEffect, runUseEffect, runApplyEffect } from './effects';

export function runCommands(ctx, effect, commands) {
  const effectDefs = ctx.cache.member[effect.ownerId].effects;
  const { memberEffects, globalEffects } = ctx.states;

  for (const { type, key, spec } of commands) {
    const effect = effectDefs[key];

    switch (type) {
      case 'remove':
        for (const target of effect.stores) {
          const state = target === 'global'
            ? globalEffects[effect.key]
            : memberEffects[target][effect.key];

          if (state) {
            runRemoveEffect(state, spec);
          }
        }
        break;

      case 'use':
        for (const target of effect.stores) {
          const state = target === 'global'
            ? globalEffects[effect.key]
            : memberEffects[target][effect.key];

          if (state) {
            runUseEffect(ctx, state, spec);
          }
        }
        break;

      case 'apply':
        runApplyEffect(ctx, effect, spec);
        break;
    }
  }
}
