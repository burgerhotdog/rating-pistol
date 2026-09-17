import { GI, WW } from '@/data';
import { getAttr, toMergedObj, resolveSpecs } from '@/utils';
import { getEffectStates } from './getEffectStates';

export const getBuffMap = (ctx, options = {}) => {
  const { memberId, action = {}, ignoreSpecs, resolveNow } = options;
  const { gameId } = ctx.cache;
  const buildMap = ctx.buildMaps[memberId] ?? {};
  const buffMap = {};
  const buffSpecs = [];

  function addToBuffSpecs(effect, buffMult) {
    const { buff = {} } = effect;
    const { specs = {} } = buff;

    buffSpecs.push({ specs, buffMult });
  };

  function getSpecsSourceMap(memberId) {
    const buildMap = ctx.buildMaps[memberId];
    const { buffMap } = getBuffMap(ctx, { memberId, ignoreSpecs: true });
    return toMergedObj(buildMap, buffMap);
  }

  for (const { effect, stacks, buffCooldown } of getEffectStates(ctx, { member: memberId, type: 'buff' })) {
    if (buffCooldown) continue;
    if (!ctx.eventFilter(effect.buff?.filter, effect, { action, fieldId: action.ownerId })) continue;

    const linkedStacks = effect.buff?.statusStacks
      ? ctx.states.negativeStatuses[effect.buff.statusStacks]?.stacks ?? 0
      : 1;
    const buffMult = (effect.chance ?? 1) * stacks * linkedStacks;

    if (effect.buff?.stats) {
      for (const stat in effect.buff.stats) {
        buffMap[stat] = (buffMap[stat] ?? 0) + effect.buff.stats[stat] * buffMult;
      }
    }

    if (effect.buff?.specs && !ignoreSpecs) {
      if (effect.ownerId === ctx.specId && !resolveNow) {
        addToBuffSpecs(effect, buffMult);
        continue;
      }

      const resolvedStatMap = resolveSpecs(effect.buff.specs, getSpecsSourceMap(effect.ownerId));

      for (const stat in resolvedStatMap) {
        buffMap[stat] = (buffMap[stat] ?? 0) + resolvedStatMap[stat] * buffMult;
      }
    }
  }

  if (gameId === GI) {
    const { superconduct } = ctx.states.aura;
    if (superconduct) {
      buffMap['physicalResReduction%'] = (buffMap['physicalResReduction%'] ?? 0) + 0.4;
    }
  }

  if (gameId === WW) {
    const { havocBane } = ctx.states.negativeStatuses;
    if (havocBane) {
      const { stacks } = havocBane;
      buffMap['defReduction%'] = (buffMap['defReduction%'] ?? 0) + 0.02 * stacks;
    }

    const tuneStrainStacks = ctx.states.tune.interferedStacks;
    if (tuneStrainStacks) {
      const tuneBreakBoost = getAttr('tuneBreakBoost', toMergedObj(buildMap, buffMap));

      buffMap['vuln%'] = (buffMap['vuln%'] ?? 0) + tuneStrainStacks * tuneBreakBoost * 0.0012;
    }
  }

  return { buffMap, buffSpecs };
};
