import { CHARACTER, WEAPON, SET, ECHO, WW } from '@/data';
import {
  isEnabled,
  normalizeEffect,
  resolveEffectTokens,
  resolveModifyEffects,
} from '@/utils';

export const getEffectDefs = (gameId, member, spec) => {
  const { memberIds } = spec;

  const sharedCtx = {
    gameId,
    ownerId: member.id,
    memberRank: member.rank,
    weaponRank: member.weaponRank,
    memberMode: member.mode,
    memberIds,
    actionDefs: spec.actionDefs,
    counts: spec.counts,
  };

  // Character effects
  const charData = CHARACTER[gameId][member.id];
  const charEffects = charData.effects ?? [];
  const normalizedCharEffects = {};

  for (const [index, rawEffect] of charEffects.entries()) {
    if (
      (
        rawEffect.rank > 0 && member.rank < rawEffect.rank ||
        rawEffect.rank < 0 && member.rank >= -rawEffect.rank
      ) ||
      rawEffect.mode && rawEffect.mode !== member.mode ||
      !isEnabled(gameId, rawEffect, member.id, spec.counts, memberIds)
    ) continue;

    const effect = normalizeEffect(gameId, rawEffect, {
      ...sharedCtx,
      sourceId: member.id,
      sourceType: 'character',
      index,
    });
    normalizedCharEffects[effect.key] = effect;
  }
  const resolvedNormalizedCharEffects = resolveEffectTokens(normalizedCharEffects);
  const modifiedCharEffects = resolveModifyEffects(resolvedNormalizedCharEffects);

  // Weapon effects
  const weapData = WEAPON[gameId][member.weaponId];
  const weapEffects = weapData.effects ?? [];
  const normalizedWeapEffects = {};
  if (weapData.type === charData.type) {
    for (const [index, rawEffect] of weapEffects.entries()) {
      if (!isEnabled(gameId, rawEffect, member.id, spec.counts, memberIds)) continue;

      const effect = normalizeEffect(gameId, rawEffect, {
        ...sharedCtx,
        sourceId: member.weaponId,
        sourceType: 'weapon',
        index,
      });
      normalizedWeapEffects[effect.key] = effect;
    }
  }
  const resolvedNormalizedWeapEffects = resolveEffectTokens(normalizedWeapEffects);
  const modifiedWeapEffects = resolveModifyEffects(resolvedNormalizedWeapEffects);

  // Set effects
  const normalizedSetEffects = {};
  for (const [setId, pcCount] of Object.entries(member.setCounts)) {
    const setEffects = SET[gameId][setId]?.effects ?? [];

    for (const [index, rawEffect] of setEffects.entries()) {
      if (
        rawEffect.bonus > pcCount ||
        !isEnabled(gameId, rawEffect, member.id, spec.counts, memberIds)
      ) continue;

      const effect = normalizeEffect(gameId, rawEffect, {
        ...sharedCtx,
        sourceId: setId,
        sourceType: 'set',
        index,
      });
      normalizedSetEffects[effect.key] = effect;
    }
  }

  // Echo effects
  if (gameId === WW) {
    const echoEffects = ECHO[member.mainEcho]?.effects ?? [];
    for (const [index, rawEffect] of echoEffects.entries()) {
      if (!isEnabled(gameId, rawEffect, member.id, spec.counts, memberIds)) continue;

      const effect = normalizeEffect(gameId, rawEffect, {
        ...sharedCtx,
        sourceId: member.mainEcho,
        sourceType: 'echo',
        index,
      });

      normalizedSetEffects[effect.key] = effect;
    }
  }
  const resolvedNormalizedSetEffects = resolveEffectTokens(normalizedSetEffects);
  const modifiedSetEffects = resolveModifyEffects(resolvedNormalizedSetEffects);

  // Resolve tokens
  return {
    charEffectDefs: modifiedCharEffects,
    weapEffectDefs: modifiedWeapEffects,
    setEffectDefs: modifiedSetEffects,
  };
};

