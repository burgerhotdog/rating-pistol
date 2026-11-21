import { CHARACTER, WEAPON, GI, WW } from '@/data';
import {
  buildEquipMap,
  buildBaseMap,
  getMemberCounts,
  toMergedObj,
} from '@/utils';
import { getActionDefs } from './actions';
import { getEffectDefs } from './effects';
import { getConvertedRotation } from './rotation';
import {
  cacheExclusiveReactions,
  cacheTeamResonance,
} from './game-specific/genshin-impact';
import {
  cacheTuneResponses,
} from './game-specific/wuthering-waves';

function buildCacheMember(cache, member) {
  const { gameId, memberIds, counts } = cache;
  const mCache = { ...member };

  const baseMap = mCache.baseMap = buildBaseMap(gameId, member.id, member.weaponId);
  const actionDefs = mCache.actions = getActionDefs(gameId, member, memberIds, baseMap);

  const { rotation, duration } = getConvertedRotation(gameId, member, member.rotation, actionDefs, memberIds, true);
  mCache.rotation = rotation;
  mCache.duration = duration;

  if (Object.hasOwn(mCache, 'rotationAlt')) {
    const { rotation, duration } = getConvertedRotation(gameId, member, member.rotationAlt, actionDefs, memberIds);
    mCache.rotationAlt = rotation;
    mCache.durationAlt = duration;
  }

  if (Object.hasOwn(mCache, 'rotationInit')) {
    const { rotation, duration } = getConvertedRotation(gameId, member, member.rotationInit, actionDefs, memberIds);
    mCache.rotationInit = rotation;
    mCache.durationInit = duration;
  }

  if (member.build?.equipList) {
    mCache.equipList = member.build.equipList;
    mCache.equipMap = buildEquipMap(mCache.equipList);
    mCache.statMap = toMergedObj(baseMap, mCache.equipMap);
  }

  const {
    charEffectDefs,
    weapEffectDefs,
    setEffectDefs,
  } = getEffectDefs(gameId, member, { memberIds, actionDefs, counts });

  mCache.charEffectDefs = charEffectDefs;
  mCache.weapEffectDefs = weapEffectDefs;
  mCache.setEffectDefs = setEffectDefs;

  const effectDefs = {
    ...charEffectDefs,
    ...weapEffectDefs,
    ...setEffectDefs,
  };

  mCache.staticMap = Object.values(effectDefs)
    .filter((effect) => effect.static)
    .reduce((acc, effect) => toMergedObj(acc, ...effect.buff.map(({ stats }) => stats)), {});

  mCache.staticEffects = Object.fromEntries(
    Object.entries(effectDefs)
      .filter(([, effect]) => effect.static)
  );

  mCache.effects = Object.fromEntries(
    Object.entries(effectDefs)
      .filter(([, effect]) => !effect.static)
  );

  const charData = CHARACTER[gameId][member.id];

  const usesUlt = [
    ...mCache.rotation,
    ...(mCache.rotationInit ?? []),
    ...(mCache.rotationAlt ?? []),
  ].some((action) =>
    action.type === 'elementalBurst' ||
    action.type === 'ultimate' ||
    action.type === 'resonanceLiberation' ||
    action.type === 'exSpecialAttack'
  );

  if (charData.energy && usesUlt) {
    mCache.energy = charData.energy;
  }

  if (gameId === WW) {
    if (charData.concertoReq) {
      mCache.concertoPenalty = !WEAPON[WW][member.weaponId]?.concerto;
    }
  }

  return mCache;
}

export const buildCache = ({ gameId, charId, team }) => {
  const fTeam = team.filter((member) => member.id);
  const memberIds = fTeam.map((member) => member.id);
  const teamSize = fTeam.length;

  const cache = {
    gameId, charId, memberIds, teamSize,
    counts: getMemberCounts(gameId, memberIds),
  };

  cache.member = Object.fromEntries(
    fTeam.map((member) => [member.id, buildCacheMember(cache, member)])
  );

  if (gameId === GI) {
    cacheExclusiveReactions(cache);
    cacheTeamResonance(cache);
  }

  if (gameId === WW) {
    cacheTuneResponses(cache);
  }

  return cache;
};
