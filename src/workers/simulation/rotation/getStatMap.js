import { WW } from '@/data';
import { getAttr, toMergedObj } from '@/utils';
import { mergeStatMap, resolveStatSpecs } from '../utils';
import { matchUseFilter } from './filter';
import { getEffectStates } from './getEffectStates';

export const getBuffMap = (ctx, options = {}) => {
  const { memberId, action = {}, ignoreSpecs, resolveNow } = options;
  const buildMap = ctx.buildMaps[memberId] ?? {};
  const buffMap = {};
  const buffSpecs = [];

  function addToBuffSpecs(effect, buffMult) {
    const { statSpecs } = effect;
    buffSpecs.push({ statSpecs, buffMult });
  };

  function getSpecsSourceMap(memberId) {
    const buildMap = ctx.buildMaps[memberId];
    const { buffMap } = getBuffMap(ctx, { memberId, ignoreSpecs: true });
    return toMergedObj(buildMap, buffMap);
  }

  for (const { effect, stacks, useCooldown } of getEffectStates(ctx, {
    member: memberId,
    type: 'buff',
  })) {
    if (useCooldown || !matchUseFilter(effect, { ctx, action })) continue;
    const buffMult = (effect.chance ?? 1) * stacks;

    if ('statMap' in effect) {
      mergeStatMap(buffMap, effect.statMap, buffMult);
    }

    if ('statSpecs' in effect && !ignoreSpecs) {
      if (effect.ownerId === ctx.currId && !resolveNow) {
        addToBuffSpecs(effect, buffMult);
        continue;
      }

      const resolvedStatMap = resolveStatSpecs(effect.statSpecs, getSpecsSourceMap(effect.ownerId));
      mergeStatMap(buffMap, resolvedStatMap, buffMult);
    }
  }

  if (ctx.gameId === WW) {
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
