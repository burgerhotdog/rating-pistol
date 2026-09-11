import { WW } from '@/data';
import { getAttr, toMergedObj } from '@/utils';
import { getEffectStates } from './getEffectStates';

const resolveStatSpecs = (buffSpec, sourceStatMap) => {
  const resolved = {};

  for (const [statId, statSpec] of Object.entries(buffSpec)) {
    const {
      attr, offset = 0, step,
      value, maxValue = Infinity,
    } = statSpec;

    const attrValue = getAttr(attr, sourceStatMap);
    const mult = Math.max((attrValue - offset) / step, 0);
    resolved[statId] = Math.min(value * mult, maxValue);
  }

  return resolved;
};

export const getBuffMap = (ctx, options = {}) => {
  const { memberId, action = {}, ignoreSpecs, resolveNow } = options;
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
    if (
      buffCooldown ||
      !ctx.eventFilter(effect.buff?.filter, action, effect)
    ) continue;
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

      const resolvedStatMap = resolveStatSpecs(effect.buff.specs, getSpecsSourceMap(effect.ownerId));

      for (const stat in resolvedStatMap) {
        buffMap[stat] = (buffMap[stat] ?? 0) + resolvedStatMap[stat] * buffMult;
      }
    }
  }

  if (ctx.cache.gameId === WW) {
    // Havoc bane
    const havocBaneStacks = ctx.states.negativeStatuses.havocBane?.stacks;
    if (havocBaneStacks) {
      buffMap['defReduction%'] ??= 0;
      buffMap['defReduction%'] += 0.02 * havocBaneStacks;
    }

    // Tune Strain
    const tuneStrainStacks = ctx.states.tune.interferedStacks;
    if (tuneStrainStacks) {
      const tuneBreakBoost = getAttr('tuneBreakBoost', toMergedObj(buildMap, buffMap));
      buffMap['vuln%'] ??= 0;
      buffMap['vuln%'] += tuneStrainStacks * tuneBreakBoost * 0.0012;
    }
  }

  return { buffMap, buffSpecs };
};
