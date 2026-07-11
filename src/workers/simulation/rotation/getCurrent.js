import { mergeObj } from '@/utils';
import { matchUseOn, matchUseIf } from '../match';
import { resolveVariableStatMap } from '../utils';

export const getCurrentEnemyMap = (ctx) => {
  const { passive: { enemy = [] } } = ctx.cache;
  const { debuffs, negativeStatuses } = ctx.state;
  const enemyMap = {};

  const effectStates = [
    ...enemy.map((effect) => ({ effect })),
    ...Object.values(debuffs),
  ];

  // Debuffs on enemy
  for (const { effect, stacks = 1 } of effectStates) {
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
  const { member, passive } = ctx.cache;
  const { effects, fieldEffects } = ctx.state;
  const { baseMap } = member[memberId];
  const equipMap = ctx.equipMaps[memberId];
  const currentMap = mergeObj(baseMap, equipMap);
  const fieldKey = memberId === ctx.onFieldId ? 'onField' : 'offField';

  const isEnabled = (effect) => {
    return matchUseOn(effect, action) && matchUseIf(effect, memberId, ctx);
  };

  const effectStates = [
    ...(passive[memberId] ?? []).map((effect) => ({ effect })),
    ...(passive[fieldKey] ?? []).map((effect) => ({ effect })),
    ...Object.values(effects[memberId]),
    ...Object.values(fieldEffects[fieldKey]),
  ];

  for (const { effect, stacks = 1 } of effectStates) {
    if (!isEnabled(effect)) continue;

    const { statMap, chance = 1 } = effect;
    if (!statMap) continue;

    for (const [statId, value] of Object.entries(statMap)) {
      currentMap[statId] ??= 0;
      currentMap[statId] += value * stacks * chance;
    }
  }

  if (ignoreVariable) return currentMap;

  for (const { effect, stacks = 1 } of effectStates) {
    if (!isEnabled(effect)) continue;
  
    const { variableStatMap, chance = 1 } = effect;
    if (!variableStatMap) continue;

    const sourceMap = getCurrentStatMap(ctx, effect.ownerId, null, true);
    const resolvedStatMap = resolveVariableStatMap(variableStatMap, sourceMap);
    for (const [statId, value] of Object.entries(resolvedStatMap)) {
      currentMap[statId] ??= 0;
      currentMap[statId] += value * stacks * chance;
    }
  }

  return currentMap;
};
