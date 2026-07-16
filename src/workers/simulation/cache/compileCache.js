import { mergeObj, mergeEquipList, compileBaseMap } from '@/utils';
import { getMemberActions } from './actions';
import { normalizeEffects } from './effects';
import { cacheTuneResponses } from './tuneResponse';

const createEquipMap = (member) => {
  if ('build' in member) {
    return mergeEquipList(member.build.equipList);
  }

  return {};
};

const convertRotation = (ctx, member, actions) => {
  const teamSize = ctx.memberIds.length;

  const rotation = [];
  let rotationTime = 0;

  for (const shortKey of member.rotation) {
    const action = actions[shortKey];

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
  if (member.id === ctx.memberIds[0]) {
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

    rotation.splice(insertAfterIndex, 0, { key: 'other:tuneBreak', ownerId: member.id });
  }

  return { rotation, rotationTime };
};

export const compileCache = (gameId, team) => {
  const memberIds = team.map((member) => member.id);
  const ctx = { gameId, memberIds };

  // Normalize actions
  const teamActions = {};
  for (const member of team) {
    teamActions[member.id] = getMemberActions(member, {
      gameId,
      teamSize: memberIds.length,
    });
  }

  const effect = {};
  const passive = [];
  const memberCache = {};
  const special = [];
  let fullRotationTime = 0;

  for (const member of team) {
    const { id: memberId, weaponId } = member;

    const baseMap = compileBaseMap(gameId, memberId, weaponId);
    const equipMap = createEquipMap(member);
    const statMap = mergeObj(baseMap, equipMap);

    const { rotation, rotationTime } = convertRotation(ctx, member, teamActions[memberId]);
    fullRotationTime += rotationTime;

    const {
      passives: currPassives,
      effectsByAction,
      specialEffects,
    } = normalizeEffects(ctx, member, teamActions);

    for (const [actionKey, effects] of Object.entries(effectsByAction)) {
      effect[actionKey] ??= [];
      effect[actionKey].push(...effects);
    }

    passive.push(...currPassives);
    special.push(...specialEffects);

    memberCache[member.id] = {
      ...member,
      equipList: member?.build?.equipList ?? [],
      baseMap,
      equipMap,
      statMap,
      rotation,
      rotationTime,
    };
  }

  const cache = {
    gameId,
    memberIds,
    member: memberCache,
    effect,
    passive,
    fullRotationTime,
    special,
  };

  cacheTuneResponses(cache, teamActions);

  return cache;
};
