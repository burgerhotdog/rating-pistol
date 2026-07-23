import { CHARACTER, WEAPON, SET } from '@/data';
import { toArray, toMergedObj } from '@/utils';
import { isEnabled } from './isEnabled';
import { toNormalizedAction } from './actions';
import { resolveRankedValue } from './resolveRanked';

function resolveApplyBy(effect, memberIds) {
  const { applyBy, ownerId } = effect;
  switch (applyBy) {
    case undefined:
      effect.applyBy = [ownerId];
      break;
    case 'team':
      effect.applyBy = memberIds;
      break;
    case 'ally':
      effect.applyBy = memberIds.filter((id) => id !== ownerId);
      break;
    case 'first':
      effect.applyBy = [memberIds[0]];
      break;
    case 'next':
      effect.applyBy = [memberIds.at(memberIds.indexOf(ownerId) - 1)];
      break;
    default:
      effect.applyBy = [applyBy];
  }
};

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
        effect[key] = toMergedObj(prev, add);
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
    return `${effect.ownerId}.${effect.sourceId}:effect${id}`;
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

  for (const prefix of ['Apply', 'Use']) {
    const doApply = `on${prefix}DoApply`;
    if (doApply in effect) {
      effect[doApply] = toResolvedMap(effect[doApply]);
    }
    const doRemove = `on${prefix}DoRemove`;
    if (doRemove in effect) {
      effect[doRemove] = toResolvedKey(effect[doRemove]);
    }
  }
}

const toNormalizedEffect = (rawEffect, spec) => {
  const {
    gameId, ownerId, sourceId, effectId,
    memberRank, weaponRank, memberIds, memberActions,
  } = spec;

  const resolveStatValue = (value) =>
    typeof value === 'number'
      ? value
      : resolveRankedValue(value, weaponRank);

  const effect = {
    ...rawEffect,
    ownerId,
    sourceId,
    key: `${ownerId}.${sourceId}:effect${effectId}`,
    id: effectId,
  };

  resolveApplyBy(effect, memberIds);
  resolveApplyTo(effect, memberIds);
  resolvePrev(effect);

  // Resolve ranked statMaps
  if (effect.statMap) {
    effect.statMap = { ...effect.statMap };

    for (const [statId, value] of Object.entries(effect.statMap)) {
      effect.statMap[statId] = resolveStatValue(value);
    }
  }

  // Resolve ranked statSpecss
  if (effect.statSpecs) {
    effect.statSpecs = { ...effect.statSpecs };

    for (const [statId, spec] of Object.entries(effect.statSpecs)) {
      const resolvedSpec = { ...spec };
      effect.statSpecs[statId] = resolvedSpec;

      for (const [field, value] of Object.entries(resolvedSpec)) {
        if (typeof value === 'string') continue;
        resolvedSpec[field] = resolveStatValue(value);
      }
    }
  }

  if ('useAction' in effect) {
    const effectActions = toArray(effect.useAction);

    effect.useAction = [];
    for (const [index, rawlinkedAction] of effectActions.entries()) {
      if (typeof rawlinkedAction === 'string') { // ref
        effect.useAction.push(memberActions[rawlinkedAction]);
      } else { // inline action object
        effect.useAction.push(toNormalizedAction(rawlinkedAction, {
          gameId,
          ownerId,
          category: `${sourceId}:effect${effectId}`,
          actionId: index,
          teamSize: memberIds.length,
          weaponRank,
        }));
      }
    }

    if (effect.useWhen === 'interval') {
      effect.useCooldown ??= 1000;
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
  const character = CHARACTER[gameId][memberId];
  const weapon = WEAPON[gameId][weaponId];

  const toNormalize = [
    {
      from: 'character',
      id: memberId,
      rawEffects: CHARACTER[gameId][memberId].effects,
    },
    {
      from: 'weapon',
      id: weaponId,
      rawEffects: WEAPON[gameId][weaponId].effects,
    },
    ...Object.entries(setCounts).map(([setId, count]) => ({
      from: 'set',
      id: setId,
      rawEffects: Object.entries(SET[gameId][setId].bonusEffects)
        .filter(([tier]) => Number(tier) <= count)
        .flatMap(([, effects]) => effects),
    })),
 ];

  const normalized = {};

  for (const { from, id, rawEffects } of toNormalize) {
    const spec = { from, rank: memberRank, character, weapon };
    for (const [index, rawEffect] of rawEffects.entries()) {
      if (!isEnabled(rawEffect, spec)) continue;

      const effect = toNormalizedEffect(rawEffect, {
        gameId,
        ownerId: memberId,
        sourceId: id,
        effectId: index,
        memberRank,
        weaponRank,
        memberIds,
        memberActions: teamActions[memberId],
      });

      normalized[effect.key] = effect;
    }
  }

  return normalized;
};
