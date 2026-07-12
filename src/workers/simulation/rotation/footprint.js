import { mergeObj, mergeObjs } from '@/utils';
import { resolveVariableStatMap } from '../utils';
import { matchUse } from '../match';
import { runDamageFormula, runTuneFormula } from './damageFormula';
import { getCurrentEnemyMap, getCurrentStatMap } from './getCurrent';

export const buildTuneFootprints = (ctx) => {
  const enemyStatMap = getCurrentEnemyMap(ctx);
  const tuneBreakStatMap = getCurrentStatMap(ctx, ctx.onFieldId);
  const tuneBreakFootprint = {
    key: `other:tuneBreak`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: runTuneFormula(ctx.helpers, enemyStatMap, tuneBreakStatMap),
  };

  const footprints = [tuneBreakFootprint];
  const shifting = ctx.state.tune.shifting;

  // Tune response
  for (const member of Object.values(ctx.cache.member)) {
    if (!('tuneResponse' in member)) continue;
    const { dmgType, element, compressed } = member.tuneResponse;
    if (dmgType !== shifting) continue;

    const responseStatMap = getCurrentStatMap(ctx, member.id);

    footprints.push({
      key: `${member.id}:tuneResponse`,
      ownerId: member.id,
      type: 'damage',
      dmgType,
      fixed: runTuneFormula(ctx.helpers, enemyStatMap, responseStatMap, compressed.mvs['tuneAmp'], element),
    });
  }

  return footprints;
};

export const buildFootprint = (ctx, action) => {
  if (!action.compressed) return;
  const { passive, member } = ctx.cache;
  const { memberEffects, fieldEffects } = ctx.state;

  const footprint = {
    ...action,
    enemyStatMap: getCurrentEnemyMap(ctx),
    fixedEffectStatMap: {},
    charVariableEffectSpecs: [],
    charConstantEffectContribsForSource: {},
    ownerBaseStatMap: null,  // only set for teammate actions with charVariableEffectSpecs
  };

  const actionOwnerFieldKey = action.ownerId === ctx.onFieldId ? 'onField' : 'offField';

  const effectStates = [
    ...(passive[action.ownerId] ?? []).map((effect) => ({ effect })),
    ...(passive[actionOwnerFieldKey] ?? []).map((effect) => ({ effect })),
    ...Object.values(memberEffects[action.ownerId]),
    ...Object.values(fieldEffects[actionOwnerFieldKey]),
  ];

  for (const effectState of effectStates) {
    const { stacks = 1, effect } = effectState;

    if (!matchUse(effect, action, action.ownerId, ctx)) continue;
    if ('followUpAction' in effect || 'intervalAction' in effect) continue;
    if (effectState.cooldown) continue;

    const { chance, statMap, variableStatMap } = effect;

    if ('statMap' in effect) { // Fixed statMap bonuses
      for (const [statId, value] of Object.entries(statMap)) {
        footprint.fixedEffectStatMap[statId] ??= 0;
        footprint.fixedEffectStatMap[statId] += value * chance * stacks;
      }
    }

    if ('variableStatMap' in effect) {
      if (effect.ownerId === ctx.currId) { // variableStatMaps that scale off currId's stats
        footprint.charVariableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else { // variableStatMaps that scale off teammate stats
        const ownerCurrentStatMap = getCurrentStatMap(ctx, effect.ownerId, undefined, true);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);

        for (const [statId, value] of Object.entries(resolvedStatMap)) {
          footprint.fixedEffectStatMap[statId] ??= 0;
          footprint.fixedEffectStatMap[statId] += value * chance * stacks;
        }
      }
    }

    if ('useCooldown' in effect) {
      effectState.cooldown = effect.useCooldown;
    }
  }

  if (footprint.charVariableEffectSpecs.length) {
    const currIdFieldKey = ctx.currId === ctx.onFieldId ? 'onField' : 'offField';

    for (const { stacks = 1, effect } of [
      ...(passive[ctx.currId] ?? []).map((effect) => ({ effect })),
      ...(passive[currIdFieldKey] ?? []).map((effect) => ({ effect })),
      ...Object.values(memberEffects[ctx.currId]),
      ...Object.values(fieldEffects[currIdFieldKey]),
    ]) {
      const { chance = 1, statMap } = effect;
      if (!statMap) continue;

      for (const [statId, value] of Object.entries(statMap)) {
        footprint.charConstantEffectContribsForSource[statId] ??= 0;
        footprint.charConstantEffectContribsForSource[statId] += value * stacks * chance;
      }
    }
  }

  // For teammate actions affected by charVariableEffectSpecs, store the owner's
  // base + equip statMap so evaluateFootprint can reconstruct full owner stats.
  if (action.ownerId !== ctx.currId && footprint.charVariableEffectSpecs.length) {
    footprint.ownerBaseStatMap = mergeObj(member[action.ownerId].baseMap, ctx.equipMaps[action.ownerId]);
  }

  // Compute fixed damage for teammate actions that aren't affected by variableStats
  if (action.ownerId !== ctx.currId && !footprint.charVariableEffectSpecs.length) {
    const statMap = mergeObjs(member[action.ownerId].baseMap, ctx.equipMaps[action.ownerId], footprint.fixedEffectStatMap);

    footprint.fixed = action.attr === 'tuneAmp'
      ? runTuneFormula(ctx.helpers, footprint.enemyStatMap, statMap, action.compressed.mvs['tuneAmp'], action.element)
      : runDamageFormula(ctx.helpers, action, footprint.enemyStatMap, statMap);
  }

  return footprint;
};

export const evaluateFootprint = (helpers, currId, footprint, statMap) => {
  const summary = {
    key: footprint.key,
    ownerId: footprint.ownerId,
    type: footprint.type,
    dmgType: footprint.dmgType,
  };

  const charVariableResolved = {};
  if (footprint.charVariableEffectSpecs.length) {
    const baseForSource = mergeObj(statMap, footprint.charConstantEffectContribsForSource);

    for (const { variableStatMap, stacks, chance } of footprint.charVariableEffectSpecs) {
      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseForSource);

      for (const [statId, value] of Object.entries(resolvedStatMap)) {
        charVariableResolved[statId] ??= 0
        charVariableResolved[statId] += value * stacks * chance;
      }
    }
  }

  const ownerBaseStatMap = footprint.ownerId === currId ? statMap : footprint.ownerBaseStatMap ?? {};
  const effectStatMap = mergeObj(footprint.fixedEffectStatMap, charVariableResolved);
  const finalStatMap = mergeObj(ownerBaseStatMap, effectStatMap);

  const value = footprint.attr === 'tuneAmp'
    ? runTuneFormula(helpers, footprint.enemyStatMap, finalStatMap, footprint.compressed.mvs['tuneAmp'], footprint.element)
    : runDamageFormula(helpers, footprint, footprint.enemyStatMap, finalStatMap);

  return { ...summary, value };
};
