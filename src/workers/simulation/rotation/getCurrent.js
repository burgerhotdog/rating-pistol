import { mergeObj } from '@/utils';
import { mergeStatMap, resolveVariableStatMap } from '../utils';
import { matchUseFilter } from './filter';

const getUsedBuffStates = (ctx, memberId, action = {}) => {
  const { memberEffects, fieldEffects } = ctx.state;
  const field = ctx.getField(memberId);
  const effectStates = [
    ...Object.values(memberEffects[memberId]),
    ...Object.values(fieldEffects[field]),
  ];

  return effectStates
    .filter(({ cooldown, effect }) =>
      ('statMap' in effect || 'variableStatMap' in effect) &&
      !cooldown &&
      matchUseFilter({ effect, action, ctx }));
};

export const resolveBuffMap = (ctx, memberId, action = {}) => {
  const usedBuffStates = getUsedBuffStates(ctx, memberId, action);
  const fixedBuffMap = {};
  const variableBuffSpecs = [];

  for (const { effect, stacks } of usedBuffStates) {
    const { statMap, variableStatMap, chance = 1 } = effect;

    if ('statMap' in effect) {
      mergeStatMap(fixedBuffMap, statMap, stacks * chance);
    }

    if ('variableStatMap' in effect) {
      const { ownerId: sourceId } = effect;

      // Source is currId, resolve later
      if (sourceId === ctx.currId) {
        variableBuffSpecs.push({ variableStatMap, mult: stacks * chance });
        continue;
      }
      
      // Otherwise, resolve now
      const sourceBuildMap = ctx.buildMaps[sourceId];
      const sourceBuffMap = {};
      for (const { effect, stacks } of getUsedBuffStates(ctx, sourceId)) {
        const { statMap, chance = 1 } = effect;
        if (!statMap) continue;
        mergeStatMap(sourceBuffMap, statMap, stacks * chance);
      }
      const sourceMap = mergeObj(sourceBuildMap, sourceBuffMap);
      const resolvedStatMap = resolveVariableStatMap(variableStatMap, sourceMap);

      mergeStatMap(fixedBuffMap, resolvedStatMap, stacks * chance);
    }
  }

  return { fixedBuffMap, variableBuffSpecs };
};

export const getEnemyMap = (ctx) => {
  const { enemyEffects, negativeStatuses } = ctx.state;
  const enemyMap = {};

  // Debuffs on enemy
  for (const { effect, stacks } of Object.values(enemyEffects)) {
    const { statMap, chance = 1 } = effect;
    if (!statMap) continue;
    mergeStatMap(enemyMap, statMap, stacks * chance);
  }

  // Havoc bane on enemy
  for (const [statusId, { stacks }] of Object.entries(negativeStatuses)) {
    if (statusId !== 'havocBane') continue;
    enemyMap['defReduction%'] ??= 0;
    enemyMap['defReduction%'] += 0.02 * stacks;
  }

  return enemyMap;
};
