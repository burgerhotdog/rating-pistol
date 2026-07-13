import { resolveVariableStatMap } from '../utils';
import { matchUse } from '../match';

export const getCurrentEnemyMap = (ctx) => {
  const { debuffs, negativeStatuses } = ctx.state;
  const enemyMap = {};

  // Debuffs on enemy
  for (const { effect, stacks = 1 } of Object.values(debuffs)) {
    const { statMap, chance = 1 } = effect;
    if (!statMap) continue;

    for (const [statId, value] of Object.entries(statMap)) {
      enemyMap[statId] ??= 0;
      enemyMap[statId] += value * stacks * chance;
    }
  }

  // Havoc bane on enemy
  for (const [statusId, { stacks }] of Object.entries(negativeStatuses)) {
    if (statusId !== 'havocBane') {
      continue;
    }

    enemyMap['defReduction%'] ??= 0;
    enemyMap['defReduction%'] += 0.02 * stacks;
  }

  return enemyMap;
};

export const getCurrentStatMap = (ctx, memberId, action, ignoreVariable) => {
  const { memberEffects, fieldEffects } = ctx.state;
  const currentMap = { ...ctx.buildMaps[memberId] };

  const fieldKey =
    memberId === ctx.onFieldId
      ? 'onField'
      : 'offField';

  const effectStates = [
    ...Object.values(memberEffects[memberId]),
    ...Object.values(fieldEffects[fieldKey]),
  ];

  for (const { effect, stacks = 1 } of effectStates) {
    if (!matchUse(effect, action, memberId, ctx)) continue;

    const { statMap, chance = 1 } = effect;
    if (!statMap) continue;

    for (const [statId, value] of Object.entries(statMap)) {
      currentMap[statId] ??= 0;
      currentMap[statId] += value * stacks * chance;
    }
  }

  if (ignoreVariable) return currentMap;

  for (const { effect, stacks = 1 } of effectStates) {
    if (!matchUse(effect, action, memberId, ctx)) continue;
  
    const { variableStatMap, chance = 1 } = effect;
    if (!variableStatMap) continue;

    const sourceMap = getCurrentStatMap(ctx, effect.ownerId, undefined, true);
    const resolvedStatMap = resolveVariableStatMap(variableStatMap, sourceMap);
    for (const [statId, value] of Object.entries(resolvedStatMap)) {
      currentMap[statId] ??= 0;
      currentMap[statId] += value * stacks * chance;
    }
  }

  return currentMap;
};
