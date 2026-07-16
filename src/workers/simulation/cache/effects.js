import { CHARACTER, WEAPON, SET } from '@/data';
import { toArray, mergeObj } from '@/utils';
import { enableIf } from './enableIf';
import { applyOn } from './applyOn';
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
      if (!(key in effect)) {
        effect[key] = add;
        continue;
      }

      const prev = effect[key];
      if (typeof prev === 'object' && !Array.isArray(prev)) {
        effect[key] = mergeObj(prev, add);
      } else if (typeof add === 'number') {
        effect[key] += add;
      } else {
        effect[key] = [
          ...toArray(effect[key]),
          ...toArray(add),
        ];
      }
    }
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
        if (typeof rawlinkedAction === 'string') {
          effect[actionType].push(memberActions[rawlinkedAction]);
        } else {
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

export const normalizeEffects = (ctx, member, actions) => {
  const { gameId, memberIds } = ctx;
  const { id: memberId, rank: memberRank, weaponId, weaponRank, setCounts } = member;

  const toNormalize = [
    ...toArray(CHARACTER[gameId][memberId].effects)
      .filter((effect) => (effect.rank ?? 0) <= memberRank),
    ...toArray(WEAPON[gameId][weaponId].effects),
    ...Object.entries(setCounts)
      .flatMap(([setId, count]) =>
        Object.entries(SET[gameId][setId].tieredEffects ?? {})
          .filter(([tier]) => Number(tier) <= count)
          .flatMap(([, effects]) => toArray(effects))),
  ];

  const passives = [];
  const effectsByAction = {};
  const specialEffects = [];

  for (const [index, rawEffect] of toNormalize.entries()) {
    if (!enableIf(rawEffect, CHARACTER[gameId][memberId])) continue;

    const effect = toNormalizedEffect(rawEffect, {
      gameId,
      ownerId: memberId,
      effectId: String(index + 1),
      memberRank,
      weaponRank,
      memberIds,
      memberActions: actions[memberId],
    });

    if (effect.applyOnSpecial) { // special
      specialEffects.push(effect);
      continue;
    }

    if (!effect.applyWhen) { // passive
      passives.push(effect);
      continue;
    }

    // active
    const actionsList = effect.applyBy === 'team'
      ? Object.values(actions).flatMap((actionMap) => Object.values(actionMap))
      : Object.values(actions[memberId]);

    for (const action of actionsList) {
      if (!applyOn(effect, action)) continue;
      effectsByAction[action.key] ??= [];
      effectsByAction[action.key].push(effect);
    }
  }

  return { passives, effectsByAction, specialEffects };
};
