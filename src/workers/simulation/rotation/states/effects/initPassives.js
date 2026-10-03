import { GI } from '@/data';
import { runApplyEffect } from './effects';

export function initPassives(ctx) {
  const { cache } = ctx;
  const { gameId } = cache;

  for (const memberId in cache.member) {
    const mCache = cache.member[memberId];

    for (const effectKey in mCache.effects) {
      const effect = mCache.effects[effectKey];
      if (effect.static || effect.apply) continue;

      runApplyEffect(ctx, effect);
    }
  }

  if (gameId === GI) {
    for (const effect of cache.elementalResonance.effects) {
      if (effect.static || effect.apply) continue;

      runApplyEffect(ctx, effect, effect.apply);
    }
  }
}
