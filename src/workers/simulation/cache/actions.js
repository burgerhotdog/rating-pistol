import { MISC, CHARACTER, ACTION } from '@/data';
import { toArray } from '@/utils';
import { resolveRankedValue } from './resolveRanked';

const DURATION_BY_CAST = {
  BA: 750,
  HA: 1000,
  MA: 1000,
  DC: 1500,
  RS: 1250,
  RL: 500,
  IS: 1000,
  OS: 0,
  CA: 0,
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
    const element = hit.element ?? spec.element ?? 'PHYSICAL';
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
        const attr = spec.attr ?? 'ATK';
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
    type: action.type ?? 'damage',
    tagged: toArray(action.tagged),
    cast: toArray(action.cast),
    considered: toArray(action.considered),
    times: action.times ?? 1,
  };

  normalized.duration ??= DURATION_BY_CAST[normalized.cast[0]] ?? 0;
  normalized.offset ??= Math.round(normalized.duration * 0.75);

  if (normalized.times === '$teamSize') {
    normalized.times = ctx.teamSize;
  }

  return normalized;
}

export const normalizeActions = (ctx, member) => {
  const skillIndex = MISC[ctx.gameId].MAX_SKILL_LEVEL - 1;
  const charData = CHARACTER[ctx.gameId][member.id];
  const actionData = ACTION[ctx.gameId][member.id];
  const addBySkillId = {};
  const normalized = {};

  if ('skillLevelMods' in charData) {
    for (const mod of charData.skillLevelMods) {
      if (mod.rank > member.rank) continue;

      addBySkillId[mod.skillId] = mod.add;
    }
  }

  for (const skillId in actionData) {
    const currentIndex = skillIndex + (addBySkillId[skillId] ?? 0);
    const skill = actionData[skillId];

    for (const actionId in skill) {
      const actionShort = `${skillId}-${actionId}`;
      const actionKey = `${member.id}:${actionShort}`;

      const resolved = {
        ...normalizeAction(ctx, member.id, skill[actionId]),
        key: actionKey,
        short: actionShort,
        id: actionId,
      };

      const spec = { element: resolved.element, attr: resolved.attr };

      if (resolved.type === 'damage') {
        spec.element ??= charData.element;
      } else {
        spec.element = resolved.type;
      }

      if ('indexedMultipliers' in resolved) {
        spec.index = currentIndex;
        resolved.compressed = compressMultipliers(resolved.indexedMultipliers, spec)
      } else {
        resolved.compressed = compressMultipliers(toArray(resolved.fixedMultipliers), spec);
      }

      normalized[actionShort] = resolved;
    }
  }

  return normalized;
};
