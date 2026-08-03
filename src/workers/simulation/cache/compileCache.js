import { WW } from '@/data';
import { toMergedObj, toEquipMap, compileBaseMap } from '@/utils';
import { getMemberPresetActions } from './actions';
import { normalizeEffects } from './effects';
import { cacheTuneResponses } from './tuneResponse';

const getConvertedRotation = (rawRotation, spec) => {
  const { gameId, memberId, memberActions, memberIds } = spec;
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

  // Insert tune break action for first character
  if (gameId === WW) {
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
        key: 'other:tuneBreak',
        ownerId: memberId,
      });
    }
  }

  return { rotation, duration };
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
    } = member;

    const baseMap = compileBaseMap(gameId, memberId, weaponId);
    const equipMap = toEquipMap(equipList);
    const statMap = toMergedObj(baseMap, equipMap);

    const { rotation, duration } = getConvertedRotation(rawRotation, {
      gameId,
      memberId,
      memberActions: teamActions[memberId],
      memberIds,
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
    };
  }

  const tuneStrainMaxStacks = cacheTuneResponses(memberCache);

  return {
    gameId,
    memberIds,
    member: memberCache,
    effects: effectsCache,
    tuneStrainMaxStacks,
    getDps(damage) {
      return damage / rotationDuration * 1000;
    },
  };
};
