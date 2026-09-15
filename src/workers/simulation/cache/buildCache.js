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
} from './game-specific/genshin-impact';
import {
  cacheTuneResponses,
} from './game-specific/wuthering-waves';

export const buildCache = ({ gameId, charId, team }) => {
  const cache = { gameId, charId };
  const fTeam = team.filter((member) => member.id);

  cache.memberIds = fTeam.map((member) => member.id);
  cache.teamSize = fTeam.length;

  cache.member = {};

  for (const member of fTeam) {
    const baseMap = buildBaseMap(gameId, member.id, member.weaponId);

    const actionDefs = getActionDefs(gameId, member, cache.teamSize, baseMap);

    const mCache = {
      ...member,
      baseMap,
      ...getConvertedRotation(gameId, member, actionDefs, cache.memberIds),
      actions: actionDefs,
    };

    if (member.build?.equipList) {
      mCache.equipList = member.build.equipList;
      mCache.equipMap = buildEquipMap(mCache.equipList);
      mCache.statMap = toMergedObj(baseMap, mCache.equipMap);
    }

    const effectDefs = getEffectDefs(gameId, member, { memberIds: cache.memberIds, actionDefs });

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

    cache.member[mCache.id] = mCache;
  }

  if (gameId === GI) {
    cacheElementalResonance(cache);
  }

  if (gameId === WW) {
    cacheTuneResponses(cache);
  }

  return cache;
};
