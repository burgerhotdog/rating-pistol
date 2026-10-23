import { convertSeedsOfDeceit, consumeSeedsOfDeceit } from '../reactions';
import { runApplyEffect } from './effects';
import { buildTransformativeReactionSnapshot } from '../snapshot';

export function hasGameRule(ctx, rule) {
  const { globalEffects } = ctx.states;

  for (const effectKey in globalEffects) {
    const { gameRule } = globalEffects[effectKey].effect;

    if (gameRule === rule) {
      return true;
    }
  }
}

export function runGameRule(ctx, rule, effect, spec) {
  if (rule === 'oceanHuedClam') {
    ctx.states.gameRule.oceanHuedClam = { ownerId: effect.ownerId, value: 0 };
  }

  if (rule === 'seaDyedFoam') {
    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, effect.ownerId, 'seaDyedFoam', 'physical');
      ctx.snapshots.push(snapshot);
    }

    delete ctx.states.gameRule.oceanHuedClam;
  }

  if (rule === 'seedsOfDeceit1') {
    convertSeedsOfDeceit(ctx);
  }

  if (rule === 'seedsOfDeceit2') {
    const seedsConsumed = consumeSeedsOfDeceit(ctx);
    for (let i = 0; i < seedsConsumed; i++) {
      runApplyEffect(ctx, effect, spec);
    }
  }
}
