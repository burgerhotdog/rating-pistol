import { WW, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  isEnabledChar,
  isEnabledWeap,
  isEnabledSet,
  isEnabledEcho,
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
  };

  // Character effects
  const charData = CHARACTER[gameId][member.id];
  const charEffects = charData.effects ?? [];
  const normalizedCharEffects = {};

  for (const [index, rawEffect] of charEffects.entries()) {
    if (!isEnabledChar(rawEffect, member, gameId, { memberIds, counts: spec.counts })) continue;

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
  for (const [index, rawEffect] of weapEffects.entries()) {
    if (!isEnabledWeap(rawEffect, charData, weapData, { counts: spec.counts })) continue;

    const effect = normalizeEffect(gameId, rawEffect, {
      ...sharedCtx,
      sourceId: member.weaponId,
      sourceType: 'weapon',
      index,
    });
    normalizedWeapEffects[effect.key] = effect;
  }
  const resolvedNormalizedWeapEffects = resolveEffectTokens(normalizedWeapEffects);
  const modifiedWeapEffects = resolveModifyEffects(resolvedNormalizedWeapEffects);

  // Set effects
  const normalizedSetEffects = {};
  for (const [setId, pcCount] of Object.entries(member.setCounts)) {
    const setEffects = SET[gameId][setId]?.effects ?? [];

    for (const [index, rawEffect] of setEffects.entries()) {
      if (!isEnabledSet(rawEffect, pcCount, charData)) continue;

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
      if (!isEnabledEcho(rawEffect, charData)) continue;

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

