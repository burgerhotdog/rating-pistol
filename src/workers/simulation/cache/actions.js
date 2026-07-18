import { GI, WW, ZZZ } from '@/data';
import { CHARACTER, ACTION } from '@/data';
import { toArray } from '@/utils';
import { resolveRankedValue } from './resolveRanked';

const DEFAULT_DURATIONS = {
  [GI]: {
    normalAttack: 1000,
    chargedAttack: 1000,
    plungeAttack: 1000,
    elementalSkill: 1000,
    elementalBurst: 2000,
  },
  [WW]: {
    basicAttack: 500,
    heavyAttack: 1500,
    midAirAttack: 1000,
    dodgeCounter: 1500,
    resonanceSkill: 1000,
    introSkill: 1000,
  },
  [ZZZ]: {
    basicAttack: 1000,
    dodgeCounter: 1000,
    dashAttack: 1000,
    assistAttack: 1000,
    specialAttack: 1000,
    chainAttack: 1000,
    ultimate: 1000,
  },
};

const getCompressed = (multipliers, attr, { index, weaponRank }) => {
  const resolveScaling = (scaling) =>
    typeof scaling === 'number'
      ? scaling // fixed
      : scaling.length === 2
        ? resolveRankedValue(scaling, weaponRank) // ranked
        : scaling[index]; // indexed

  const compressed = { flat: 0, mvs: {}, hitCount: 0 };
  for (const { flat, mv, times = 1 } of toArray(multipliers)) {
    if (flat) {
      compressed.flat += resolveScaling(flat) * times;
    }
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

export const toNormalizedAction = (rawAction, spec) => {
  const {
    gameId, ownerId, category, actionId,
    teamSize, index, charElement, weaponType, weaponRank,
  } = spec;

  const action = {
    ...rawAction,
    ownerId,
    key: `${ownerId}:${category}.${actionId}`,
    short: `${category}.${actionId}`,
    id: actionId,
  };

  // Init default action type
  if (action.multipliers) {
    action.type ??= 'damage';
  }

  // Init default dmgType
  if (action.type === 'damage' && action.skillType) {
    action.dmgType ??= action.skillType;
  }

  // Resolve $teamSize
  if (action.times === '$teamSize') {
    action.times = teamSize;
  }

  if (action.multipliers) {
    // Init element
    if (action.type === 'damage') {
      if (gameId === GI && category === 'normalAttack' && weaponType !== 'catalyst') {
        action.element ??= 'physical';
      } else {
        action.element ??= charElement;
      }
    }

    // Init attr
    action.attr ??= 'atk';

    // Compress multipliers
    action.compressed = getCompressed(action.multipliers, action.attr, {
      index,
      weaponRank,
    });
  }

  // Init duration
  if (!('duration' in action)) {
    const defaults = DEFAULT_DURATIONS[gameId];
    action.duration = defaults[action.skillType] ?? 0;
  }

  // Init hitOffsets
  if (!('hitOffsets' in action)) {
    if (action.compressed) {
      let offset = action.duration * 0.65;
      action.hitOffsets = [Math.round(offset)];

      let hitsLeft = action.compressed.hitCount - 1;
      while (hitsLeft) {
        if (action.duration) {
          action.duration += 50;
          offset += 50;
        }
        action.hitOffsets.push(Math.round(offset));
        hitsLeft--;
      }
    }
  }

  return action;
}

const createIndexGetter = (gameId, memberId, memberRank) => {
  const defaultIndex = gameId === ZZZ ? 11 : 9;

  const { rankMods = {} } = CHARACTER[gameId][memberId];
  const addByCategory = {};
  for (const [rank, mod] of Object.entries(rankMods)) {
    if (Number(rank) > memberRank) continue;
    for (const [category, offset] of Object.entries(mod)) {
      addByCategory[category] ??= 0;
      addByCategory[category] += offset;
    }
  }

  return (category) => defaultIndex + (addByCategory[category] ?? 0);
};

export const getMemberActions = (member, { gameId, teamSize }) => {
  const { id: memberId } = member;
  const char = CHARACTER[gameId][memberId];
  const getIndex = createIndexGetter(gameId, memberId, member.rank);

  const memberActions = {};
  for (const [category, skill] of Object.entries(ACTION[gameId][memberId])) {
    const index = getIndex(category);

    for (const [actionId, rawAction] of Object.entries(skill)) {
      memberActions[`${category}.${actionId}`] = toNormalizedAction(rawAction, {
        gameId,
        ownerId: memberId,
        category,
        actionId,
        teamSize,
        index,
        charElement: char.element,
      });
    }
  }

  return memberActions;
};
