import { CHARACTER, ECHO, GI, WW } from '@/data';
import { getMvIndex, normalizeAction } from '@/utils';

const getSpecialOffset = (gameId, memberIds, category) => {
  if (gameId !== GI || category !== 'elementalSkill') return 0;
  if (!memberIds.includes(10000114)) return 0;

  const elements = new Set(memberIds.map((id) => CHARACTER[gameId][id].element));

  return elements.size === 2 &&
    elements.has('hydro') &&
    elements.has('cryo') ? 1 : 0;
};

export const getActionDefs = (gameId, member, memberIds, baseMap) => {
  const { id: ownerId, skillLevels } = member;
  const { element: charElement, type: weaponType, skills } = CHARACTER[gameId][ownerId];

  const actionDefs = {};

  for (const [category, { actions }] of Object.entries(skills)) {
    const userLevel = skillLevels[category];

    const mvIndex =
      getMvIndex(gameId, ownerId, member.rank, category, userLevel) +
      getSpecialOffset(gameId, memberIds, category);

    const sharedSpec = {
      ownerId,
      category,
      memberIds,
      mvIndex,
      charElement,
      weaponType,
      mode: member.mode,
      baseMap,
    }

    for (const [index, rawAction] of actions.entries()) {
      const action = normalizeAction(gameId, rawAction, { ...sharedSpec, index });
      actionDefs[action.ref] = action;
    }
  }

  // Echo action
  if (gameId === WW) {
    const echoAction = ECHO[member.mainEcho]?.action;

    if (echoAction) {
      const action = normalizeAction(WW, echoAction, {
        ownerId,
        category: 'echoSkill',
        index: 0,
      });
      actionDefs[action.ref] = action;
    }
  }

  return actionDefs;
};
