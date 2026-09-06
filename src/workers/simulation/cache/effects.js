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

    const effectId = `${member.id}.${member.id}:effect${index}`;
    normalized[effectId] = normalizeEffect(gameId, rawEffect, {
      ...sharedNormCtx,
      sourceId: member.id,
      sourceType: 'character',
      index,
    });
  }

  // Weapon effects
  const weapData = WEAPON[gameId][member.weaponId];
  const weapEffects = weapData.effects ?? [];
  for (const [index, rawEffect] of weapEffects.entries()) {
    if (!isEnabledWeap(rawEffect, charData, weapData)) continue;

    const effectId = `${member.id}.${member.weaponId}:effect${index}`;
    normalized[effectId] = normalizeEffect(gameId, rawEffect, {
      ...sharedNormCtx,
      sourceId: member.weaponId,
      sourceType: 'weapon',
      index,
    });
  }

  // Set effects
  for (const [setId, pcCount] of Object.entries(member.setCounts)) {
    const setEffects = SET[gameId][setId]?.effects ?? [];

    for (const [index, rawEffect] of setEffects.entries()) {
      if (!isEnabledSet(rawEffect, pcCount, charData)) continue;

      const effectId = `${member.id}.${setId}:effect${index}`;
      normalized[effectId] = normalizeEffect(gameId, rawEffect, {
        ...sharedNormCtx,
        sourceId: setId,
        sourceType: 'set',
        index,
      });
    }
  }

  // Echo effects
  if (gameId === WW) {
    const echoEffects = ECHO[member.mainEcho]?.effects ?? [];
    for (const [index, rawEffect] of echoEffects.entries()) {
      if (!isEnabledEcho(rawEffect, charData)) continue;

      const effectId = `${member.id}.${member.mainEcho}:effect${index}`;
      normalized[effectId] = normalizeEffect(gameId, rawEffect, {
        ...sharedNormCtx,
        sourceId: member.mainEcho,
        sourceType: 'echo',
        index,
      });
    }
  }

  // Resolve tokens
  return resolveEffectTokens(normalized);
};

