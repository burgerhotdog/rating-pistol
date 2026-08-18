import { WW, CHARACTER, ECHO } from '@/data';
import { toMergedObj, toEquipMap, compileBaseMap } from '@/utils';
import { getActionDefs } from './actions';
import { normalizeEffects } from './effects';
import { cacheTuneResponses } from './tuneResponse';

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

export const compileCache = ({ gameId, charId, team }) => {
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

    mCache.baseMap = compileBaseMap(gameId, member.id, member.weaponId);
    if (member.build?.equipList) {
      mCache.equipList = member.build.equipList;
      mCache.equipMap = toEquipMap(mCache.equipList);
      mCache.statMap = toMergedObj(mCache.baseMap, mCache.equipMap);
    }

    const actionDefs = getActionDefs(gameId, member, cache.teamSize);

    const { rotation, duration } = getConvertedRotation(gameId, member, actionDefs, cache.memberIds);
    mCache.rotation = rotation;
    mCache.duration = duration;
    cache.rotationDuration += duration;

    const effectDefs = normalizeEffects(gameId, member, { memberIds: cache.memberIds, actionDefs });
    Object.assign(cache.effects, effectDefs);

    const charData = CHARACTER[gameId][member.id];
    if (charData.tagged.includes('healing')) mCache.healing = true;
    if (charData.tagged.includes('shield')) mCache.shield = true;
    if (charData.energy) mCache.energy = charData.energy;

    cache.member[member.id] = mCache;
  }

  cacheTuneResponses(cache);

  return cache;
};
