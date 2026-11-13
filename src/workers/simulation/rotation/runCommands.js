import { runRemoveEffect, runUseEffect, runApplyEffect } from './states';
import { runRuleCommand } from './rules';

function runRemoveCommand(ctx, effect, spec) {
  const { memberEffects, globalEffects } = ctx.states;

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
}

function runUseCommand(ctx, effect, spec = {}) {
  const { memberEffects, globalEffects } = ctx.states;

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

    if (!state?.effect?.use) break;

    if (spec.respectCooldown && state.useCooldown) break;

    for (const [index, use] of state.effect.use.entries()) {
      const useSpec = {};

      if (effect.snapshotBuffs) {
        useSpec.snapshotBuffs = state.snapshotBuffs[index];
      }

      runUseEffect(ctx, state, use, useSpec);

      break;
    }
  }
}

export function runCommands(ctx, sourceId, commands, applier) {
  const effectDefs = ctx.cache.member[sourceId].effects;

  for (const { filter, type, key, spec, rule } of commands) {
    if (!ctx.eventFilter(filter, sourceId, {}, applier)) continue;

    const effect = effectDefs[key];
    if (!effect) throw new Error(`Could not resolve effect: ${key}`);

    switch (type) {
      case 'remove':
        runRemoveCommand(ctx, effect, spec);
        break;

      case 'use':
        runUseCommand(ctx, effect, spec);
        break;

      case 'apply':
        runApplyEffect(ctx, effect, spec, { applier });
        break;

      case 'rule':
        runRuleCommand(ctx, rule, effect, spec);
        break;
    }
  }
}
