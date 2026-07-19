import { CHARACTER, WEAPON, SET } from '@/data';
import { toArray, mergeObj } from '@/utils';
import { enableIf } from './enableIf';
import { toNormalizedAction } from './actions';
import { resolveRankedValue } from './resolveRanked';

function resolveApplyTo(effect, memberIds) {
  const { applyTo, ownerId } = effect;

  switch (applyTo) {
    case undefined:
      effect.applyTo = [ownerId];
      break;
    case 'team':
      effect.applyTo = memberIds;
      break;
    case 'ally':
      effect.applyTo = memberIds.filter((id) => id !== ownerId);
      break;
    case 'first':
      effect.applyTo = [memberIds[0]];
      break;
    case 'next':
      effect.applyTo = [memberIds.at(memberIds.indexOf(ownerId) - 1)];
      break;
    default:
      effect.applyTo = [applyTo];
  }
};

function resolveRankMods(effect, memberRank) {
  const { rankMods } = effect;

  for (const [rank, modSpec] of Object.entries(rankMods)) {
    if (Number(rank) > memberRank) continue;

    for (const [key, add] of Object.entries(modSpec)) {
      if (!(key in effect)) { // no previous existing field
        effect[key] = add;
        continue;
      }

      const prev = effect[key];
      if (typeof prev === 'object' && !Array.isArray(prev)) { // merge objects
        effect[key] = mergeObj(prev, add);
      } else if (typeof add === 'number') { // combine numbers
        effect[key] += add;
      } else { // merge string arrays
        effect[key] = [
          ...toArray(effect[key]),
          ...toArray(add),
        ];
      }
    }
  }
}

function resolvePrev(effect) {
  const toResolvedKey = (rawKey) => {
    if (!rawKey.startsWith('$prev.')) return rawKey;
    const id = Number(effect.id) - Number(rawKey.slice(6));
    return `${effect.ownerId}:effect${id}`;
  }

  const toResolvedMap = (rawMap) => {
    const resolved = {};
    for (const [rawKey, stacks] of Object.entries(rawMap)) {
      resolved[toResolvedKey(rawKey)] = stacks;
    }
    return resolved;
  }

  for (const prefix of ['apply', 'remove', 'use']) {
    for (const suffix of ['Min', 'Max']) {
      const field = `${prefix}IfEffectStacks${suffix}`;
      if (!effect[field]) continue;
      effect[field] = toResolvedMap(effect[field]);
    }
  }

  if (effect.onApplyDoApplyEffect) {
    effect.onApplyDoApplyEffect = toResolvedMap(effect.onApplyDoApplyEffect);
  }

  if (effect.onApplyDoRemoveEffect) {
    effect.onApplyDoRemoveEffect = toResolvedKey(effect.onApplyDoRemoveEffect);
  }
}

const toNormalizedEffect = (rawEffect, spec) => {
  const {
    gameId, ownerId, effectId,
    memberRank, weaponRank, memberIds, memberActions,
  } = spec;

  const resolveStatValue = (value) =>
    typeof value === 'number'
      ? value
      : resolveRankedValue(value, weaponRank);

  const effect = {
    ...rawEffect,
    ownerId,
    key: `${ownerId}:effect${effectId}`,
    id: effectId,
  };

  resolveApplyTo(effect, memberIds);
  resolvePrev(effect);

  // Resolve ranked statMaps
  if (effect.statMap) {
    effect.statMap = { ...effect.statMap };

    for (const [statId, value] of Object.entries(effect.statMap)) {
      effect.statMap[statId] = resolveStatValue(value);
    }
  }

  // Resolve ranked variableStatMaps
  if (effect.variableStatMap) {
    effect.variableStatMap = { ...effect.variableStatMap };

    for (const [statId, spec] of Object.entries(effect.variableStatMap)) {
      const resolvedSpec = { ...spec };
      effect.variableStatMap[statId] = resolvedSpec;

      for (const [field, value] of Object.entries(resolvedSpec)) {
        if (typeof value === 'string') continue;
        resolvedSpec[field] = resolveStatValue(value);
      }
    }
  }

  for (const actionType of ['followUpAction', 'intervalAction']) {
    if (actionType in effect) {
      const effectActions = toArray(effect[actionType]);

      effect[actionType] = [];
      for (const [index, rawlinkedAction] of effectActions.entries()) {
        if (typeof rawlinkedAction === 'string') { // shortKey referencing actions.json
          effect[actionType].push(memberActions[rawlinkedAction]);
        } else { // inline action object
          effect[actionType].push(toNormalizedAction(rawlinkedAction, {
            gameId,
            ownerId,
            category: `effect${effectId}`,
            actionId: String(index + 1),
            teamSize: memberIds.length,
            weaponRank,
          }));
        }
      }

      if (actionType === 'intervalAction') {
        effect.intervalCooldown ??= 1000;
      }
    }
  }

  if (effect.rankMods) {
    resolveRankMods(effect, memberRank);
  }

  return effect;
};

export const normalizeEffects = (member, spec) => {
  const { gameId, memberIds, teamActions } = spec;
  const { id: memberId, rank: memberRank, weaponId, weaponRank, setCounts } = member;

  const toNormalize = [
    ...toArray(CHARACTER[gameId][memberId].effects)
      .filter((effect) => (effect.rank ?? 0) <= memberRank),
    ...toArray(WEAPON[gameId][weaponId].effects),
    ...Object.entries(setCounts)
      .flatMap(([setId, count]) =>
        Object.entries(SET[gameId][setId].bonusEffects ?? {})
          .filter(([tier]) => Number(tier) <= count)
          .flatMap(([, effects]) => toArray(effects))),
  ];

  const effectLookup = {};
  const memberEffects = [];
  const passiveEffects = [];
  const globalEffects = [];
  const tuneBreakEffects = [];

  for (const [index, rawEffect] of toNormalize.entries()) {
    if (!enableIf(rawEffect, CHARACTER[gameId][memberId])) continue;

    const effect = toNormalizedEffect(rawEffect, {
      gameId,
      ownerId: memberId,
      effectId: String(index + 1),
      memberRank,
      weaponRank,
      memberIds,
      memberActions: teamActions[memberId],
    });

    effectLookup[effect.key] = effect;

    if (!effect.applyWhen) { // Passive effects
      passiveEffects.push(effect);
    } else if (effect.applyWhen === 'tuneBreak') { // Tune break effects
      tuneBreakEffects.push(effect);
    } else if (effect.applyBy === 'any') { // Global effects
      globalEffects.push(effect);
    } else {
      memberEffects.push(effect);
    }
  }

  return {
    effectLookup,
    memberEffects,
    passiveEffects,
    globalEffects,
    tuneBreakEffects,
  };
};
