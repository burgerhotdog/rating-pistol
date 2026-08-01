import { WW } from '@/data';
import { toMergedObj, mergeEquipList, compileBaseMap } from '@/utils';
import { getMemberPresetActions } from './actions';
import { normalizeEffects } from './effects';
import { cacheTuneResponses } from './tuneResponse';

const getConvertedRotation = (rawRotation, spec) => {
  const { gameId, memberId, memberActions, memberIds } = spec;
  const teamSize = memberIds.length;

  const rotation = [];
  let rotationTime = 0;

  // Convert refs to actions
  for (const ref of rawRotation) {
    const action = memberActions[ref];

    if (teamSize === 1) {
      const { type } = action;
      if (type === 'introSkill' || type === 'outroSkill') continue;
    }

    rotationTime += action.duration ?? 0;
    rotation.push(action);
  }

  // Insert tune break action for first character
  if (gameId === WW) {
    if (memberId === memberIds[0]) {
      // Ensure no more than 8000 ms remain after tune break
      let timeLeft = rotationTime;
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

  return { rotation, rotationTime };
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

  const cache = {
    gameId,
    memberIds,
    member: {},
    fullRotationTime: 0,
    effects: {},
  };

  for (const member of team) {
    const {
      id: memberId,
      weaponId,
      rotation: rawRotation,
      build: { equipList = [] } = {},
    } = member;

    const baseMap = compileBaseMap(gameId, memberId, weaponId);
    const equipMap = mergeEquipList(equipList);
    const statMap = toMergedObj(baseMap, equipMap);

    const { rotation, rotationTime } = getConvertedRotation(rawRotation, {
      gameId,
      memberId,
      memberActions: teamActions[memberId],
      memberIds,
    });

    cache.fullRotationTime += rotationTime;

    const effectLookup = normalizeEffects(gameId, member, { memberIds, teamActions });
    Object.assign(cache.effects, effectLookup);

    cache.member[memberId] = {
      ...member,
      equipList,
      baseMap,
      equipMap,
      statMap,
      rotation,
      rotationTime,
    };
  }

  cacheTuneResponses(cache);

  return cache;
};
