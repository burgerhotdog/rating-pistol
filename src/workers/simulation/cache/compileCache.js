import { WW } from '@/data';
import { mergeObj, mergeEquipList, compileBaseMap } from '@/utils';
import { getMemberActions } from './actions';
import { normalizeEffects } from './effects';
import { cacheTuneResponses } from './tuneResponse';

const getConvertedRotation = (rawRotation, spec) => {
  const { gameId, memberId, memberActions, memberIds } = spec;
  const teamSize = memberIds.length;

  const rotation = [];
  let rotationTime = 0;

  // Convert shortKeys to actions
  for (const shortKey of rawRotation) {
    const action = memberActions[shortKey];

    if (teamSize === 1) {
      const { skillType } = action;

      if (skillType === 'introSkill' || skillType === 'outroSkill') {
        continue;
      }
    }

    rotationTime += action.duration ?? 0;
    rotation.push(action);
  }

  // Insert tune break action for first character
  if (gameId === WW) {
    if (memberId === memberIds[0]) {
      // Ensure no more than 8000 ms remain after tune break
      let timeLeft = rotationTime;
      let insertAfterIndex = 0;
      for (const action of rotation) {
        if (timeLeft <= 8000) break;

        timeLeft -= action.duration;
        insertAfterIndex++;
      }

      if (insertAfterIndex === 0) {
        insertAfterIndex++;
      }

      rotation.splice(insertAfterIndex, 0, {
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
    teamActions[member.id] = getMemberActions(member, {
      gameId,
      teamSize: memberIds.length,
    });
  }

  const passive = [];
  const memberCache = {};
  const special = [];
  let fullRotationTime = 0;

  const appliedByTeam = [];

  for (const member of team) {
    const {
      id: memberId,
      weaponId,
      rotation: rawRotation,
      build: { equipList = [] } = {},
    } = member;

    const baseMap = compileBaseMap(gameId, memberId, weaponId);
    const equipMap = mergeEquipList(equipList);
    const statMap = mergeObj(baseMap, equipMap);

    const { rotation, rotationTime } = getConvertedRotation(rawRotation, {
      gameId,
      memberId,
      memberActions: teamActions[memberId],
      memberIds,
    });

    fullRotationTime += rotationTime;

    const {
      passives: currPassives,
      specialEffects,
      appliedByAny,
      appliedBySelf,
    } = normalizeEffects(member, {
      gameId,
      memberIds,
      teamActions,
    });

    appliedByTeam.push(...appliedByAny);

    passive.push(...currPassives);
    special.push(...specialEffects);

    memberCache[memberId] = {
      ...member,
      equipList,
      baseMap,
      equipMap,
      statMap,
      rotation,
      rotationTime,
      appliedBySelf,
    };
  }

  const cache = {
    gameId,
    memberIds,
    member: memberCache,
    passive,
    fullRotationTime,
    special,
    appliedByTeam,
  };

  cacheTuneResponses(cache, teamActions);

  return cache;
};
