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
    const { buffSpec } = effect;
    buffSpecs.push({ buffSpec, buffMult });
  };

  function getSpecsSourceMap(memberId) {
    const buildMap = ctx.buildMaps[memberId];
    const { buffMap } = getBuffMap(ctx, { memberId, ignoreSpecs: true });
    return toMergedObj(buildMap, buffMap);
  }

  for (const { effect, stacks, buffCooldown } of getEffectStates(ctx, { member: memberId, type: 'buff' })) {
    if (buffCooldown || !matchUseFilter(effect, { ctx, action })) continue;
    const buffMult = (effect.chance ?? 1) * stacks;

    if ('buffMap' in effect) {
      mergeStatMap(buffMap, effect.buffMap, buffMult);
    }

    if ('buffSpec' in effect && !ignoreSpecs) {
      if (effect.ownerId === ctx.currId && !resolveNow) {
        addToBuffSpecs(effect, buffMult);
        continue;
      }

      const resolvedStatMap = resolveStatSpecs(effect.buffSpec, getSpecsSourceMap(effect.ownerId));
      mergeStatMap(buffMap, resolvedStatMap, buffMult);
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
