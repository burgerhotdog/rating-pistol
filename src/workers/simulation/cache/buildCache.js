import { WW, CHARACTER, WEAPON, ECHO } from '@/data';
import {
  buildEquipMap,
  buildBaseMap,
  buildMenuMap,
  clamp,
  getEnergyLevel,
  toMergedObj,
} from '@/utils';
import { getActionDefs } from './actions';
import { getEffectDefs } from './effects';

function adjustTimings(rotation, actual, expected) {
  if (!expected) return;
  const ratio = expected / actual;

  const adjusted = new Set([]);

  for (const action of rotation) {
    if (adjusted.has(action.id)) continue;
    adjusted.add(action.id);

    action.duration = Math.round(action.duration * ratio);
    if (action.hitOffsets) {
      for (const [index, offset] of action.hitOffsets.entries()) {
        action.hitOffsets[index] = Math.round(offset * ratio);
      }
    }
  }
}

const getConvertedRotation = (gameId, member, actionDefs, memberIds) => {
  const {
    id: memberId,
    mainEcho,
    rotation: rawRotation,
    duration: rotationDuration,
  } = member;
  const teamSize = memberIds.length;

  const rotation = [];
  let duration = 0;

  // Convert refs to actions
  for (const ref of rawRotation) {
    const action = actionDefs[ref];

    if (teamSize === 1) {
      const { type } = action;
      if (type === 'introSkill' || type === 'outroSkill') continue;
    }

    duration += action.duration ?? 0;
    rotation.push(action);
  }

  if (gameId === WW) {
    // Insert main echo rotation
    if (ECHO[mainEcho]?.action) {
      let insertAtIndex = rotation.length;

      if (ECHO[mainEcho]?.timing === 'start') {
        insertAtIndex = rotation[0]?.type === 'introSkill' ? 1 : 0;
      } else {
        if (rotation.at(-1)?.type === 'outroSkill') insertAtIndex = -1;
      }

      rotation.splice(insertAtIndex, 0, actionDefs['echoSkill.0']);
    }

    // Insert tune break action for first character
    if (memberId === memberIds[0]) {
      // Ensure no more than 8000 ms remain after tune break
      let timeLeft = duration;
      let insertAtIndex = 0;
      for (const action of rotation) {
        if (timeLeft <= 8000) break;

        timeLeft -= action.duration;
        insertAtIndex++;
      }

      if (insertAtIndex === 0) insertAtIndex++;

      rotation.splice(insertAtIndex, 0, {
        id: 'other:tuneBreak',
        ownerId: memberId,
      });
    }
  }

  if (!rotationDuration) return { rotation, duration };

  adjustTimings(rotation, duration, rotationDuration)
  return { rotation, duration: rotationDuration };
};

export const buildCache = ({ gameId, charId, team }) => {
  const cache = { gameId, charId };
  const fTeam = team.filter((member) => member.id);
  cache.memberIds = fTeam.map((member) => member.id);
  cache.teamSize = fTeam.length;

  cache.member = {};
  cache.effects = {};
  cache.rotationDuration = 0;

  for (const member of fTeam) {
    const mCache = {};

    mCache.id = member.id;
    mCache.rank = member.rank;
    mCache.weaponId = member.weaponId;
    mCache.weaponRank = member.weaponRank;
    mCache.setCounts = member.setCounts;
    mCache.mainEcho = member.mainEcho;
    mCache.skillLevels = member.skillLevels;

    mCache.baseMap = buildBaseMap(gameId, member.id, member.weaponId);
    if (member.build?.equipList) {
      mCache.equipList = member.build.equipList;
      mCache.equipMap = buildEquipMap(mCache.equipList);
      mCache.statMap = toMergedObj(mCache.baseMap, mCache.equipMap);
      mCache.menuMap = buildMenuMap(gameId, member.id, team, { baseMap: mCache.baseMap, equipMap: mCache.equipMap });
    }

    const actionDefs = getActionDefs(gameId, member, cache.teamSize);

    const { rotation, duration } = getConvertedRotation(gameId, member, actionDefs, cache.memberIds);
    mCache.rotation = rotation;
    mCache.duration = duration;
    cache.rotationDuration += duration;

    const effectDefs = getEffectDefs(gameId, member, { memberIds: cache.memberIds, actionDefs });

    mCache.staticMap = Object.values(effectDefs)
      .filter((effect) => effect.static)
      .reduce((acc, effect) => {
        const { stats } = effect.buff;
        return toMergedObj(acc, stats);
      }, {});

    mCache.effects = effectDefs;
    Object.assign(cache.effects, effectDefs);

    const charData = CHARACTER[gameId][member.id];
    if (charData.tagged.includes('healing')) mCache.healing = true;
    if (charData.tagged.includes('shield')) mCache.shield = true;

    if (charData.concertoReq) {
      mCache.concertoPenalty = !WEAPON[WW][member.weaponId]?.concerto;
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

    cache.member[member.id] = mCache;
  }

  cacheTuneResponses(cache);

  return cache;
};

const alwaysStrain = new Set([1209, 1510, 1413]);
const onlyStrainIfMode = new Set([1509, 1211]);

function cacheTuneResponses(cache) {
  cache.tuneStrainMaxStacks = 1;

  for (const mCache of Object.values(cache.member)) {
    const isStrain =
      alwaysStrain.has(mCache.id) ||
      (onlyStrainIfMode.has(mCache.id) && mCache.mode === 'tuneStrain');
    if (!isStrain) continue;

    mCache.tuneStrainResponse = true;
    cache.tuneStrainMaxStacks++;
  }
}
