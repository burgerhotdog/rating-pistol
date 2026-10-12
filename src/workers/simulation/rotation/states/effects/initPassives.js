import { GI } from '@/data';
import { runApplyEffect } from './runApplyEffect';

export function initPassives(ctx) {
  const { cache } = ctx;
  const { gameId } = cache;

  for (const memberId in cache.member) {
    const mCache = cache.member[memberId];

    for (const effectKey in mCache.effects) {
      const effect = mCache.effects[effectKey];
      if (effect.static || effect.apply) continue;

      runApplyEffect(ctx, effect, { stacks: effect.maxStacks ?? 1 });
    }
  }

  if (gameId === GI) {
    for (const effect of cache.teamResonance.effects) {
      if (effect.static || effect.apply) continue;

      runApplyEffect(ctx, effect, effect.apply);
    }
  }
}
