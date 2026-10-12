import { runRemoveEffect } from './runRemoveEffect';
import { runUseEffect } from './runUseEffect';
import { runApplyEffect } from './runApplyEffect';
import { runGameRule } from '../gameRules';

export function runCommands(ctx, effect, commands, applier) {
  const effectDefs = ctx.cache.member[effect.ownerId].effects;
  const { memberEffects, globalEffects } = ctx.states;

  for (const { type, key, spec, gameRule } of commands) {
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
        if (!effect) {
          throw new Error(`Could not resolve effect: ${key}`);
        }
        runApplyEffect(ctx, effect, spec, { applier });
        break;

      case 'gameRule':
        runGameRule(ctx, gameRule, effect, spec);
        break;
    }
  }
}
