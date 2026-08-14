import { WW, ECHO } from '@/data';
import { toMergedObj, toEquipMap, compileBaseMap } from '@/utils';
import { getMemberPresetActions } from './actions';
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

const getConvertedRotation = (rawRotation, spec) => {
  const { gameId, memberId, memberActions, memberIds, mainEcho } = spec;
  const teamSize = memberIds.length;

  const rotation = [];
  let duration = 0;

  // Convert refs to actions
  for (const ref of rawRotation) {
    const action = memberActions[ref];

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

      if (ECHO[mainEcho]?.timing === 'afterIntro') {
        insertAtIndex = rotation[0]?.type === 'introSkill' ? 1 : 0;
      } else {
        if (rotation.at(-1)?.type === 'outroSkill') insertAtIndex = -1;
      }

      rotation.splice(insertAtIndex, 0, memberActions['echoSkill.0']);
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

  if (!spec.rotationDuration) return { rotation, duration };

  adjustTimings(rotation, duration, spec.rotationDuration)
  return { rotation, duration: spec.rotationDuration };
};

export const compileCache = (gameId, team) => {
  const memberIds = team.map((member) => member.id);

  // Normalize actions
  const teamActions = {};
  for (const member of team) {
    teamActions[member.id] = getMemberPresetActions(member, {
      gameId,
      teamSize: memberIds.length,
    });
  }

  const memberCache = {};
  const effectsCache = {};
  let rotationDuration = 0;

  for (const member of team) {
    const {
      id: memberId,
      weaponId,
      rotation: rawRotation,
      build: { equipList = [] } = {},
      mainEcho,
    } = member;

    const baseMap = compileBaseMap(gameId, memberId, weaponId);
    const equipMap = toEquipMap(equipList);
    const statMap = toMergedObj(baseMap, equipMap);

    const { rotation, duration } = getConvertedRotation(rawRotation, {
      gameId,
      memberId,
      memberActions: teamActions[memberId],
      memberIds,
      mainEcho,
      rotationDuration: member.duration, 
    });

    rotationDuration += duration;

    const effectLookup = normalizeEffects(gameId, member, { memberIds, teamActions });
    Object.assign(effectsCache, effectLookup);

    memberCache[memberId] = {
      ...member,
      equipList,
      baseMap,
      equipMap,
      statMap,
      rotation,
      duration,
    };
  }

  const cache = {
    gameId,
    memberIds,
    member: memberCache,
    effects: effectsCache,
    rotationDuration,
    getDps(damage) {
      return damage / rotationDuration * 1000;
    },
  }

  cacheTuneResponses(cache);

  return cache;
};
