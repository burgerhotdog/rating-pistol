import { mergeObj, mergeEquipList, compileBaseMap } from '@/utils';
import { normalizeActions } from './actions';
import { normalizeEffects } from './effects';

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

    rotationTime += action.duration;
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

  const actions = {};
  const effect = {};
  const passive = {};
  const memberCache = {};
  const special = [];
  let fullRotationTime = 0;

  for (const member of team) {
    actions[member.id] = normalizeActions(ctx, member);
  }

  for (const member of team) {
    const baseMap = compileBaseMap(gameId, member.id, member.weaponId);
    const equipMap = createEquipMap(member);
    const statMap = mergeObj(baseMap, equipMap);

    const { rotation, rotationTime } = convertRotation(ctx, member, actions[member.id]);
    fullRotationTime += rotationTime;

    const { passivesbyTarget, effectsByAction, specialEffects } = normalizeEffects(ctx, member, actions);

    special.push(...specialEffects);

    for (const [actionKey, effects] of Object.entries(effectsByAction)) {
      effect[actionKey] ??= [];
      effect[actionKey].push(...effects);
    }

    for (const [applyTo, passives] of Object.entries(passivesbyTarget)) {
      passive[applyTo] ??= [];
      passive[applyTo].push(...passives);
    }

    memberCache[member.id] = {
      ...member,
      equipList: member?.build?.equipList ?? [],
      baseMap,
      equipMap,
      statMap,
      rotation,
      rotationTime,
    };

    const tuneResponse = Object.values(actions[member.id])
      .find((action) => action.skillType === 'tuneResponse');

    if (tuneResponse) {
      memberCache[member.id].tuneResponse = tuneResponse;
    }
  }

  return {
    gameId,
    memberIds,
    member: memberCache,
    effect,
    passive,
    fullRotationTime,
    special,
  };
};
