import { MISC, CHARACTER, WEAPON } from '@/data';
import { mergeObj, mergeObjs, mergeEquipList } from '@/utils';
import { normalizeActions } from './actions';
import { normalizeEffects } from './effects';

const createBaseMap = (gameId, member) => {
  return mergeObjs(
    MISC[gameId].DEFAULT_STATS,
    CHARACTER[gameId][member.id].stats,
    WEAPON[gameId][member.weaponId].stats,
  );
};

const createEquipMap = (member) => {
  if ('build' in member) {
    return mergeEquipList(member.build.equipList);
  }

  return {};
};

const convertRotation = (member, actions) => {
  const rotation = [];
  let rotationTime = 0;

  for (const shortKey of member.rotation) {
    const action = actions[shortKey];
    rotationTime += action.duration;
    rotation.push(action);
  }

  return { rotation, rotationTime };
};

export const compileCache = (gameId, team) => {
  const ctx = {
    gameId,
    idList: team.map(member => member.id),
    teamSize: team.length,
  };

  const effect = {};
  const passive = {};
  const memberCache = {};
  let fullRotationTime = 0;

  for (const member of team) {
    const baseMap = createBaseMap(gameId, member);
    const equipMap = createEquipMap(member);
    const statMap = mergeObj(baseMap, equipMap);

    const actions = normalizeActions(ctx, member);

    const { rotation, rotationTime } = convertRotation(member, actions);
    fullRotationTime += rotationTime;

    const { passivesbyTarget, effectsByAction } = normalizeEffects(ctx, member, actions);

    for (const actionKey in effectsByAction) {
      effect[actionKey] = effectsByAction[actionKey];
    }

    for (const target in passivesbyTarget) {
      passive[target] ??= [];
      passive[target].push(...passivesbyTarget[target]);
    }

    memberCache[member.id] = {
      ...member,
      baseMap,
      equipMap,
      statMap,
      rotation,
      rotationTime,
    };
  }

  return { gameId, member: memberCache, effect, passive, fullRotationTime };
};
