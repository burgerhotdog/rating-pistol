import { GI, WW, CHARACTER, WEAPON } from '@/data';
import {
  buildEquipMap,
  buildBaseMap,
  clamp,
  getEnergyLevel,
  toMergedObj,
} from '@/utils';
import { getActionDefs } from './actions';
import { getEffectDefs } from './effects';
import { getConvertedRotation } from './rotation';
import {
  cacheElementalResonance,
  countMembersGI,
} from './game-specific/genshin-impact';
import {
  cacheTuneResponses,
  countMembersWW,
} from './game-specific/wuthering-waves';

function countMembers(gameId, memberIds) {
  switch (gameId) {
    case GI:
      return countMembersGI(memberIds);
    case WW:
      return countMembersWW(memberIds);
  }
}

function buildCacheMember(cache, member) {
  const { gameId, memberIds, teamSize, counts } = cache;
  const mCache = { ...member };

  const baseMap = mCache.baseMap = buildBaseMap(gameId, member.id, member.weaponId);
  const actionDefs = mCache.actions = getActionDefs(gameId, member, teamSize, baseMap);

  const { rotation, duration } = getConvertedRotation(gameId, member, actionDefs, memberIds);
  mCache.rotation = rotation;
  mCache.duration = duration;

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
    .reduce((acc, effect) => toMergedObj(acc, effect.buff.stats), {});

  mCache.staticEffects = Object.fromEntries(
    Object.entries(effectDefs)
      .filter(([, effect]) => effect.static)
  );

  mCache.effects = Object.fromEntries(
    Object.entries(effectDefs)
      .filter(([, effect]) => !effect.static)
  );

  const charData = CHARACTER[gameId][member.id];

  if (charData.tagged.includes('healing')) {
    mCache.healing = true;
  }

  if (charData.tagged.includes('shield')) {
    mCache.shield = true;
  }

  if (charData.energy) {
    mCache.energy = charData.energy;

    const { energyMin = 1, energyMax = Infinity } = charData;
    if (!mCache.statMap) {
      mCache.energyReq = energyMin;
    } else {
      const energyLevel = getEnergyLevel(gameId, mCache.statMap);
      mCache.energyReq = clamp(energyLevel, energyMin, energyMax);
    }
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
    counts: countMembers(gameId, memberIds),
  };

  cache.member = Object.fromEntries(
    fTeam.map((member) => [member.id, buildCacheMember(cache, member)])
  );

  if (gameId === GI) {
    cacheElementalResonance(cache);
  }

  if (gameId === WW) {
    cacheTuneResponses(cache);
  }

  return cache;
};
