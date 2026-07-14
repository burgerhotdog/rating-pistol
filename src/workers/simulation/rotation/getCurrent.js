import { mergeObj } from '@/utils';
import { mergeStatMap, resolveVariableStatMap } from '../utils';
import { matchUse, onAction, onType, onTagged, onSkillType, onDmgType, onElement, ifAttr, ifField, ifNegativeStatus, ifShifting, ifInterfered } from '../match';

const getAllBuffStates = (ctx, memberId) => {
  const { memberEffects, fieldEffects } = ctx.state;
  const fieldId = memberId === ctx.onFieldId ? 'onField' : 'offField';

  return [
    ...Object.values(memberEffects[memberId])
      .map((effectState) => ['member', memberId, effectState]),
    ...Object.values(fieldEffects[fieldId])
      .map((effectState) => ['field', fieldId, effectState]),
  ].filter(([,, { effect }]) =>
    'statMap' in effect || 'variableStatMap' in effect);
};

export const getUsedBuffStates = (ctx, memberId, action = {}) => {
  const matchUseOn = (effect) => 
    onAction(effect.useOnAction, action) ||
    onType(effect.useOnType, action) ||
    onTagged(effect.useOnTagged, action) ||
    onSkillType(effect.useOnSkillType, action) ||
    onDmgType(effect.useOnDmgType, action) ||
    onElement(effect.useOnElement, action.element);

  const matchUseIf = (effect) => 
    ifAttr(effect.useIfAttr, ctx.buildMaps[effect.ownerId]) ||
    ifField(effect.useIfField, action.ownerId, ctx.onFieldId) ||
    ifNegativeStatus(effect.useIfNegativeStatus, ctx.state) ||
    ifShifting(effect.useIfShifting, ctx.state) ||
    ifInterfered(effect.useIfInterfered, ctx.state);

  return getAllBuffStates(ctx, memberId)
    .filter(([,, { cooldown, effect }]) => {
      const hasUseOn = Object.keys(effect)
        .some((key) => key.startsWith('useOn'));

      const hasUseIf = Object.keys(effect)
        .some((key) => key.startsWith('useIf'));

      return !cooldown &&
        (!hasUseOn || matchUseOn(effect)) &&
        (!hasUseIf || matchUseIf(effect));
    });
};

export const resolveBuffMap = (ctx, usedBuffStates) => {
  const fixedBuffMap = {};
  const variableBuffSpecs = [];

  for (const [,, { effect, stacks }] of usedBuffStates) {
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
      for (const [,, { effect, stacks }] of getUsedBuffStates(ctx, sourceId)) {
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
  const { debuffs, negativeStatuses } = ctx.state;
  const enemyMap = {};

  // Debuffs on enemy
  for (const { effect, stacks } of Object.values(debuffs)) {
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

  if (ignoreVariable) {
    return currentMap;
  }

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
