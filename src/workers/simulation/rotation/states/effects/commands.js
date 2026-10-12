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
          let state;

          if (target === 'global') {
            state = globalEffects[effect.key];
          } else if (target === '$next') {
            const index = ctx.cache.memberIds.indexOf(effect.ownerId);
            const id = ctx.cache.memberIds.at(index - 1);
            state = memberEffects[id][effect.key];
          } else {
            state = memberEffects[target][effect.key];
          }

          if (state) {
            runRemoveEffect(state, spec);
          }
        }
        break;

      case 'use':
        for (const target of effect.stores) {
          let state;

          if (target === 'global') {
            state = globalEffects[effect.key];
          } else if (target === '$next') {
            const index = ctx.cache.memberIds.indexOf(effect.ownerId);
            const id = ctx.cache.memberIds.at(index - 1);
            state = memberEffects[id][effect.key];
          } else {
            state = memberEffects[target][effect.key];
          }

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
