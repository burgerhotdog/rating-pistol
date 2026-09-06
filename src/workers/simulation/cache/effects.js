import { WW, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  isEnabledChar,
  isEnabledWeap,
  isEnabledSet,
  isEnabledEcho,
  normalizeEffect,
  resolveEffectTokens,
} from '@/utils';

export const normalizeEffects = (gameId, member, spec) => {
  const normalized = {};

  const sharedNormCtx = {
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

    const sourceId = member.id;
    const sourceType = 'character';
    const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
    const effect = normalizeEffect(gameId, rawEffect, normCtx);
    normalized[effect.id] = effect;
  }

  // Weapon effects
  const weapData = WEAPON[gameId][member.weaponId];
  const weapEffects = weapData.effects ?? [];
  for (const [index, rawEffect] of weapEffects.entries()) {
    if (!isEnabledWeap(rawEffect, charData, weapData)) continue;

    const sourceId = member.weaponId;
    const sourceType = 'weapon';
    const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
    const effect = normalizeEffect(gameId, rawEffect, normCtx);
    normalized[effect.id] = effect;
  }

  // Set effects
  for (const [setId, pcCount] of Object.entries(member.setCounts)) {
    const setEffects = SET[gameId][setId]?.effects ?? [];
    for (const [index, rawEffect] of setEffects.entries()) {
      if (!isEnabledSet(rawEffect, pcCount, charData)) continue;

      const sourceId = setId;
      const sourceType = 'set';
      const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
      const effect = normalizeEffect(gameId, rawEffect, normCtx);
      normalized[effect.id] = effect;
    }
  }

  // Echo effects
  if (gameId === WW) {
    const echoEffects = ECHO[member.mainEcho]?.effects ?? [];
    for (const [index, rawEffect] of echoEffects.entries()) {
      if (!isEnabledEcho(rawEffect, charData)) continue;

      const sourceId = member.mainEcho;
      const sourceType = 'echo';
      const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
      const effect = normalizeEffect(gameId, rawEffect, normCtx);
      normalized[effect.id] = effect;
    }
  }

  // Resolve tokens
  return resolveEffectTokens(normalized);
};

