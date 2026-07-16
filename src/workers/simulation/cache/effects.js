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

const toNormalizedEffect = (rawEffect, ctx, member, effectId, memberActions) => {
  const { gameId, memberIds } = ctx;
  const { id: memberId, rank: memberRank, weaponRank } = member;

  const resolveStatValue = (value) =>
    typeof value === 'number'
      ? value
      : resolveRankedValue(value, weaponRank);

  const effect = { ...rawEffect };

  effect.ownerId = memberId;
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
            ownerId: memberId,
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
  const toNormalize = [
    ...toArray(CHARACTER[ctx.gameId][member.id].effects)
      .filter((effect) => (effect.rank ?? 0) <= member.rank),
    ...toArray(WEAPON[ctx.gameId][member.weaponId].effects),
  ];

  for (const [setId, count] of Object.entries(member.setCounts)) {
    const { tieredEffects = {} } = SET[ctx.gameId][setId];

    for (const [tier, effects] of Object.entries(tieredEffects)) {
      if (Number(tier) > count) continue;
      toNormalize.push(...toArray(effects));
    }
  }

  const passives = [];
  const effectsByAction = {};
  const specialEffects = [];

  for (const [index, rawEffect] of toNormalize.entries()) {
    const effectId = String(index + 1);
    const effectKey = `${member.id}:EFFECT_${effectId}`;

    if (!enableIf(rawEffect, CHARACTER[ctx.gameId][member.id])) {
      continue;
    }

    const resolved = {
      ...toNormalizedEffect(rawEffect, ctx, member, effectId, actions[member.id]),
      key: effectKey,
      id: effectId,
    };

    if ('applyOnSpecial' in resolved) {
      specialEffects.push(resolved);
      continue;
    }

    if ('applyWhen' in resolved) { // active
      const actionsList = resolved.applyBy === 'team'
        ? Object.values(actions).flatMap((actionMap) => Object.values(actionMap))
        : Object.values(actions[member.id]);

      for (const action of actionsList) {
        if (!applyOn(resolved, action)) {
          continue;
        }

        effectsByAction[action.key] ??= [];
        effectsByAction[action.key].push(resolved);
      }
    } else { // passive
      passives.push(resolved);
    }
  }

  return { passives, effectsByAction, specialEffects };
};
