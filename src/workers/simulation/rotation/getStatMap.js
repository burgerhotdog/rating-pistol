import { WW } from '@/data';
import { getAttr, toMergedObj } from '@/utils';
import { mergeStatMap, resolveVariableStatMap } from '../utils';
import { matchUseFilter } from './filter';
import { getEffectStates } from './getEffectStates';

export const getDebuffMap = (ctx, spec = {}) => {
  const { action = {}, ignoreVariable, resolveNow } = spec;
  const debuffMap = {};
  const debuffSpecs = [];

  for (const { effect, stacks, useCooldown } of getEffectStates(ctx, {
    enemy: true,
    type: 'buff',
  })) {
    if (useCooldown || !matchUseFilter(effect, { ctx, action })) continue;
    const buffMult = (effect.chance ?? 1) * stacks;

    if ('statMap' in effect) {
      mergeStatMap(debuffMap, effect.statMap, buffMult);
    }

    if ('variableStatMap' in effect && !ignoreVariable) {
      if (effect.ownerId === ctx.currId && !resolveNow) {
        debuffSpecs.push({
          variableStatMap: effect.variableStatMap,
          mult: buffMult,
        });
        continue;
      }

      const buildMap = ctx.buildMaps[effect.ownerId];
      const sourceBuffMap = getBuffMap(ctx, effect.ownerId, { ignoreVariable: true }).buffMap;
      const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, toMergedObj(buildMap, sourceBuffMap));
      mergeStatMap(debuffMap, resolvedStatMap, buffMult);
    }
  }

  if (ctx.gameId === WW) { // Havoc bane
    const havocBaneStacks = ctx.state.negativeStatuses.havocBane?.stacks;
    if (havocBaneStacks) {
      debuffMap['defReduction%'] ??= 0;
      debuffMap['defReduction%'] += 0.02 * havocBaneStacks;
    }
  }

  return { debuffMap, debuffSpecs };
};

export const getBuffMap = (ctx, memberId, spec = {}) => {
  const { action = {}, ignoreVariable, resolveNow } = spec;
  const buildMap = ctx.buildMaps[memberId];
  const buffMap = {};
  const buffSpecs = [];

  for (const { effect, stacks, useCooldown } of getEffectStates(ctx, {
    member: memberId,
    type: 'buff',
  })) {
    if (useCooldown || !matchUseFilter(effect, { ctx, action })) continue;
    const buffMult = (effect.chance ?? 1) * stacks;

    if ('statMap' in effect) {
      mergeStatMap(buffMap, effect.statMap, buffMult);
    }

    if ('variableStatMap' in effect && !ignoreVariable) {
      if (effect.ownerId === ctx.currId && !resolveNow) {
        buffSpecs.push({
          variableStatMap: effect.variableStatMap,
          mult: buffMult,
        });
        continue;
      }

      const buildMap = ctx.buildMaps[effect.ownerId];
      const sourceBuffMap = getBuffMap(ctx, effect.ownerId, { ignoreVariable: true }).buffMap;
      const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, toMergedObj(buildMap, sourceBuffMap));
      mergeStatMap(buffMap, resolvedStatMap, buffMult);
    }
  }

  if (ctx.gameId === WW) { // Tune Strain
    const tuneStrainStacks = ctx.state.tune.interferedStacks;
    if (tuneStrainStacks) {
      const tuneBreakBoost = getAttr('tuneBreakBoost', toMergedObj(buildMap, buffMap));
      buffMap['vuln%'] ??= 0;
      buffMap['vuln%'] += tuneStrainStacks * tuneBreakBoost * 0.0012;
    }
  }

  return { buffMap, buffSpecs };
};
