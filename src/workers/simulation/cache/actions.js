import { GI, HSR, WW, ZZZ } from '@/data';
import { CHARACTER, ACTION } from '@/data';
import { toArray } from '@/utils';
import { resolveRankedValue } from './resolveRanked';

const createIndexGetter = (gameId, member) => {
  const { rankMods = {} } = CHARACTER[gameId][member.id];
  const index = gameId === ZZZ ? 11 : 9;
  const addByCategory = {};

  for (const [rank, mod] of Object.entries(rankMods)) {
    if (Number(rank) > member.rank) {
      continue;
    }

    for (const [category, offset] of Object.entries(mod)) {
      addByCategory[category] ??= 0;
      addByCategory[category] += offset;
    }
  }

  return (category) => index + (addByCategory[category] ?? 0);
};

const DURATION_BY_CAST = {
  [GI]: {
    normalAttack: 1000,
    chargedAttack: 1000,
    plungeAttack: 1000,
    elementalSkill: 1000,
    elementalBurst: 1000,
  },
  [HSR]: {
    basicAtk: 1000,
    skill: 1000,
    ultimate: 1000,
  },
  [WW]: {
    basicAttack: 750,
    heavyAttack: 1000,
    midAirAttack: 1000,
    dodgeCounter: 1500,
    resonanceSkill: 1250,
    resonanceLiberation: 500,
    introSkill: 1000,
    outroSkill: 0,
    coordinatedAttack: 0,
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

export const compressMultipliers = (multipliers, spec = {}) => {
  const resolveScaling = (scaling) => {
    if ('index' in spec) {
      return scaling[spec.index];
    } else if ('weaponRank' in spec) {
      return resolveRankedValue(scaling, spec.weaponRank);
    } else {
      return scaling;
    }
  };

  const compressed = { flat: 0, mvs: {}, hitCount: 0 };

  for (const { flat, mv, times = 1 } of multipliers) {
    if (flat) {
      compressed.flat += resolveScaling(flat) * times;
    }

    if (mv) {
      if (typeof mv === 'object' && !Array.isArray(mv)) {
        for (const [attr, scaling] of Object.entries(mv)) { // dual attr scaling
          compressed.mvs[attr] ??= 0;
          compressed.mvs[attr] += resolveScaling(scaling) * times;
        }
      } else { // single attr scaling
        const attr = spec.attr ?? 'atk';
        compressed.mvs[attr] ??= 0;
        compressed.mvs[attr] += resolveScaling(mv) * times;
      }
    }

    compressed.hitCount += times;
  }

  return compressed;
};

export const normalizeAction = (ctx, memberId, action) => {
  const normalized = {
    ...action,
    ownerId: memberId,
    tagged: toArray(action.tagged),
    times: action.times ?? 1,
  };

  const hasMultipliers =
    'fixedMultipliers' in action ||
    'indexedMultipliers' in action ||
    'rankedMultipliers' in action;

  if (hasMultipliers) {
    normalized.type ??= 'damage';
  }

  if (normalized.type === 'damage' && normalized.skillType != null) {
    normalized.dmgType ??= normalized.skillType;
  }

  normalized.duration ??= DURATION_BY_CAST[ctx.gameId][normalized.skillType] ?? 0;
  normalized.offset ??= Math.round(normalized.duration * 0.75);

  if (normalized.times === '$teamSize') {
    normalized.times = ctx.memberIds.length;
  }

  return normalized;
}

export const normalizeActions = (ctx, member) => {
  const char = CHARACTER[ctx.gameId][member.id];
  const getIndex = createIndexGetter(ctx.gameId, member);
  const normalized = {};

  for (const [category, skill] of Object.entries(ACTION[ctx.gameId][member.id])) {
    for (const [actionId, action] of Object.entries(skill)) {
      const actionShort = `${category}.${actionId}`;
      const actionKey = `${member.id}:${actionShort}`;

      const resolved = {
        ...normalizeAction(ctx, member.id, action),
        key: actionKey,
        short: actionShort,
        id: actionId,
      };

      // Element
      if (resolved.type === 'damage') {
        if (ctx.gameId === GI && category === 'normalAttack' && char.type !== 'catalyst') {
          resolved.element ??= 'physical';
        } else {
          resolved.element ??= char.element;
        }
      }

      // Compress multipliers
      const { indexedMultipliers, fixedMultipliers } = resolved;
      if (indexedMultipliers) {
        const spec = { attr: resolved.attr, index: getIndex(category) };
        resolved.compressed = compressMultipliers(indexedMultipliers, spec)
      } else if (fixedMultipliers) {
        const spec = { attr: resolved.attr };
        resolved.compressed = compressMultipliers(toArray(fixedMultipliers), spec);
      }

      normalized[actionShort] = resolved;
    }
  }

  return normalized;
};
