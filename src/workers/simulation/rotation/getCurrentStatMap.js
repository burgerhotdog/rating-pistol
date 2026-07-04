import { mergeObj } from '@/utils';
import { matchUseOn, matchUseIf } from '../match';
import { resolveVariableStatMap } from '../utils';

export const getCurrentEnemyStatMap = (ctx) => {
  const { cache, enemyState } = ctx;
  const currentMap = {};

  for (const { stacks = 1, effect } of [
    ...(cache.passive.enemy ?? []).map(effect => ({ effect })),
    ...Object.values(enemyState.stat),
  ]) {
    const { chance = 1, statMap } = effect;
    if (!statMap) continue;

    for (const statId in statMap) {
      currentMap[statId] ??= 0;
      currentMap[statId] += statMap[statId] * stacks * chance;
    }
  }

  return currentMap;
};

export const getCurrentStatMap = (ctx, memberId, action) => {
  const { cache, memberState, fieldState } = ctx;
  const { baseMap } = cache.member[memberId];
  const equipMap = ctx.equipMapByMember[memberId];
  const currentMap = mergeObj(baseMap, equipMap);

  const isOnField = memberId === ctx.onFieldId;
  const fieldEffectStates = isOnField ? fieldState.active : fieldState.inactive;

  const isEnabled = (effect) => {
    return matchUseOn(effect, action) && matchUseIf(effect, memberId, ctx);
  };

  const allEffectStates = [
    ...(cache.passive[memberId] ?? []).map(effect => ({ effect })),
    ...(cache.passive[isOnField ? 'active' : 'inactive'] ?? []).map(effect => ({ effect })),
    ...Object.values(memberState[memberId]),
    ...Object.values(fieldEffectStates),
  ];

  for (const { stacks = 1, effect } of allEffectStates) {
    if (!isEnabled(effect)) continue;
  
    const { chance = 1, statMap } = effect;
    if (!statMap) continue;

    for (const statId in statMap) {
      currentMap[statId] ??= 0;
      currentMap[statId] += statMap[statId] * stacks * chance;
    }
  }

  for (const { stacks = 1, effect } of allEffectStates) {
    if (!isEnabled(effect)) continue;
  
    const { chance = 1, variableStatMap } = effect;
    if (!variableStatMap) continue;

    const resolvedStatMap = resolveVariableStatMap(variableStatMap, currentMap);
    for (const statId in resolvedStatMap) {
      currentMap[statId] ??= 0;
      currentMap[statId] += resolvedStatMap[statId] * stacks * chance;
    }
  }

  return currentMap;
};
