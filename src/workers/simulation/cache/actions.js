import { WW, ECHO } from '@/data';
import { CHARACTER } from '@/data';
import { resolveRankedValue, normalizeAction } from '@/utils';

export const getCompressed = (multipliers, attr, { index, weaponRank }) => {
  const resolveScaling = (scaling) =>
    typeof scaling === 'number'
      ? scaling // fixed
      : scaling.length === 2
        ? resolveRankedValue(scaling, weaponRank) // ranked
        : scaling[index]; // indexed

  const compressed = { flat: 0, mvs: {}, hitCount: 0 };
  for (const { flat, mv, times = 1 } of multipliers) {
    if (flat) compressed.flat += resolveScaling(flat) * times;
    if (mv) {
      if (typeof mv === 'object' && !Array.isArray(mv)) { // dual attr scaling
        for (const [attrKey, scaling] of Object.entries(mv)) {
          compressed.mvs[attrKey] ??= 0;
          compressed.mvs[attrKey] += resolveScaling(scaling) * times;
        }
      } else { // single attr scaling
        compressed.mvs[attr] ??= 0;
        compressed.mvs[attr] += resolveScaling(mv) * times;
      }
    }
    compressed.hitCount += times;
  }
  return compressed;
};

export function createMvIndexGetter(gameId, member) {
  const { rankMods = {} } = CHARACTER[gameId][member.id];
  const addByCategory = {};
  for (const [rank, mod] of Object.entries(rankMods)) {
    if (Number(rank) > member.rank) continue;
    for (const [category, offset] of Object.entries(mod)) {
      addByCategory[category] ??= 0;
      addByCategory[category] += offset;
    }
  }

  return (category) => member.skillLevels[category] - 1 + (addByCategory[category] ?? 0);
}

export const getActionDefs = (gameId, member, teamSize) => {
  const getMvIndex = createMvIndexGetter(gameId, member);
  const charData = CHARACTER[gameId][member.id];
  const actionDefs = {};

  // Character actions
  for (const [category, { actions }] of Object.entries(charData.skills)) {
    const spec = {
      ownerId: member.id,
      category,
      teamSize,
      mvIndex: getMvIndex(category),
      charElement: charData.element,
      mode: member.mode,
    }

    for (const [index, rawAction] of actions.entries()) {
      const action = normalizeAction(gameId, rawAction, { ...spec, index });
      actionDefs[action.ref] = action;
    }
  }

  // Echo action
  if (gameId === WW) {
    const echoAction = ECHO[member.mainEcho]?.action;
    if (echoAction) {
      const spec = {
        ownerId: member.id,
        category: 'echoSkill',
        index: 0,
        teamSize,
      };
      const action = normalizeAction(WW, echoAction, spec);
      actionDefs[action.ref] = action;
    }
  }

  return actionDefs;
};
