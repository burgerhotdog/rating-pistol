import {
  isEnabled,
  normalizeEffect,
  resolveEffectTokens,
  resolveModifyEffects,
} from '@/utils';

export function getNormWeapEffs(cache, ownerId, weapData, weaponRank) {
  const { gameId, memberIds, counts } = cache;
  const { id: weaponId, effects = [] } = weapData;

  const sharedCtx = {
    gameId,
    ownerId,
    sourceId: weaponId,
    sourceType: 'weapon',
    weaponRank,
    memberIds,
    counts,
  };

  const normalized = {};

  for (const [index, rawEffect] of effects.entries()) {
    if (!isEnabled(gameId, rawEffect, ownerId, counts, memberIds)) continue;

    const effect = normalizeEffect(gameId, rawEffect, { ...sharedCtx, index });

    normalized[effect.key] = effect;
  }

  const tokensResolved = resolveEffectTokens(normalized);

  return resolveModifyEffects(tokensResolved);
}
