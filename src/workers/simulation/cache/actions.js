import { GI, HSR, WW, ZZZ } from '@/data';
import { CHARACTER, ACTION } from '@/data';
import { toArray } from '@/utils';
import { resolveRankedValue } from './resolveRanked';

const MV_INDEX = {
  [GI]: 9,
  [HSR]: 9,
  [WW]: 9,
  [ZZZ]: 11,
};

const makeGetIndex = (gameId, member) => {
  const { rankMods = {} } = CHARACTER[gameId][member.id];
  const defaultIndex = MV_INDEX[gameId];
  const addByCategory = {};

  for (const rank in rankMods) {
    if (Number(rank) > member.rank) continue;

    const mod = rankMods[rank];
    for (const category in mod) {
      addByCategory[category] ??= 0;
      addByCategory[category] += mod[category];
    }
  }

  return (category) => defaultIndex + (addByCategory[category] ?? 0);
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

  const compressed = {};

  for (const hit of multipliers) {
    const element = hit.element ?? spec.element ?? 'Physical';
    const times = hit.times ?? 1;
    compressed[element] ??= { flat: 0, mv: {}, hitCount: 0 };
    const compiled = compressed[element];

    if ('flat' in hit) {
      compiled.flat += resolveScaling(hit.flat) * times;
    }

    if ('mv' in hit) {
      if (typeof hit.mv === 'object' && !Array.isArray(hit.mv)) {
        for (const attr in hit.mv) { // dual attr scaling
          compiled.mv[attr] ??= 0;
          compiled.mv[attr] += resolveScaling(hit.mv[attr]) * times;
        }
      } else { // single attr scaling
        const attr = spec.attr ?? 'atk';
        compiled.mv[attr] ??= 0;
        compiled.mv[attr] += resolveScaling(hit.mv) * times;
      }
    }

    compiled.hitCount += times;
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

  const hasMultipliers = 'fixedMultipliers' in action || 'indexedMultipliers' in action || 'rankedMultipliers' in action;
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
  const { type: weapType, element: charElement } = CHARACTER[ctx.gameId][member.id];
  const actionData = ACTION[ctx.gameId][member.id];
  const normalized = {};
  const getIndex = makeGetIndex(ctx.gameId, member);

  for (const category in actionData) {
    const skill = actionData[category];

    for (const actionId in skill) {
      const actionShort = `${category}.${actionId}`;
      const actionKey = `${member.id}:${actionShort}`;

      const resolved = {
        ...normalizeAction(ctx, member.id, skill[actionId]),
        key: actionKey,
        short: actionShort,
        id: actionId,
      };

      if (ctx.gameId === GI && resolved.type === 'damage') {
        if (category === 'normalAttack' && weapType !== 'catalyst') {
          resolved.element ??= 'physical';
        } else {
          resolved.element ??= charElement;
        }
      }

      if (ctx.gameId !== GI && resolved.type === 'damage') {
        resolved.element ??= charElement;
      }

      const spec = {
        element: resolved.element ?? resolved.type,
        attr: resolved.attr,
      };

      if ('indexedMultipliers' in resolved) {
        spec.index = getIndex(category);
        resolved.compressed = compressMultipliers(resolved.indexedMultipliers, spec)
      } else if ('fixedMultipliers' in resolved) {
        resolved.compressed = compressMultipliers(toArray(resolved.fixedMultipliers), spec);
      }

      normalized[actionShort] = resolved;
    }
  }

  return normalized;
};
