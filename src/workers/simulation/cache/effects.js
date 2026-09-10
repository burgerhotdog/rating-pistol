import { WW, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  isEnabledChar,
  isEnabledWeap,
  isEnabledSet,
  isEnabledEcho,
  normalizeEffect,
  resolveEffectTokens,
} from '@/utils';

export const getEffectDefs = (gameId, member, spec) => {
  const normalized = {};

  const sharedCtx = {
    gameId,
    ownerId: member.id,
    memberRank: member.rank,
    weaponRank: member.weaponRank,
    memberMode: member.mode,
    memberIds: spec.memberIds,
    actionDefs: spec.actionDefs,
  };

  // Character effects
  const charData = CHARACTER[gameId][member.id];
  const charEffects = charData.effects ?? [];
  for (const [index, rawEffect] of charEffects.entries()) {
    if (!isEnabledChar(rawEffect, member, gameId, spec.memberIds)) continue;

    const effect = normalizeEffect(gameId, rawEffect, {
      ...sharedCtx,
      sourceId: member.id,
      sourceType: 'character',
      index,
    });
    normalized[effect.key] = effect;
  }

  // Weapon effects
  const weapData = WEAPON[gameId][member.weaponId];
  const weapEffects = weapData.effects ?? [];
  for (const [index, rawEffect] of weapEffects.entries()) {
    if (!isEnabledWeap(rawEffect, charData, weapData)) continue;

    const effect = normalizeEffect(gameId, rawEffect, {
      ...sharedCtx,
      sourceId: member.weaponId,
      sourceType: 'weapon',
      index,
    });
    normalized[effect.key] = effect;
  }

  // Set effects
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
      normalized[effect.key] = effect;
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
      normalized[effect.key] = effect;
    }
  }

  // Resolve tokens
  return resolveEffectTokens(normalized);
};

