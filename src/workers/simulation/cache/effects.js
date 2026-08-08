import { CHARACTER, WEAPON, SET, ECHO } from '@/data';
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
    case '$team':
      effect.applyBy = memberIds;
      break;
    case '$ally':
      effect.applyBy = memberIds.filter((id) => id !== ownerId);
      break;
    case '$first':
      effect.applyBy = [memberIds[0]];
      break;
    case '$next':
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
    case '$team':
      effect.applyTo = memberIds;
      break;
    case '$ally':
      effect.applyTo = memberIds.filter((id) => id !== ownerId);
      break;
    case '$first':
      effect.applyTo = [memberIds[0]];
      break;
    case '$next':
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

    for (const [field, add] of Object.entries(modSpec)) {
      if (!(field in effect)) { // no previous existing field
        effect[field] = add;
        continue;
      }

      const prev = effect[field];
      if (typeof prev === 'object' && !Array.isArray(prev)) { // merge objects
        effect[field] = toMergedObj(prev, add);
      } else if (typeof add === 'number') { // combine numbers
        effect[field] += add;
      } else { // merge string arrays
        effect[field] = [
          ...toArray(effect[field]),
          ...toArray(add),
        ];
      }
    }
  }
}

const toNormalizedEffect = (rawEffect, spec) => {
  const {
    gameId, ownerId, sourceId, effectIndex,
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
    id: `${ownerId}.${sourceId}:effect${effectIndex}`,
    index: effectIndex,
  };

  resolveApplyBy(effect, memberIds);
  resolveApplyTo(effect, memberIds);

  // Resolve ranked buffMaps
  if (effect.buffMap) {
    effect.buffMap = { ...effect.buffMap };

    for (const [statId, value] of Object.entries(effect.buffMap)) {
      effect.buffMap[statId] = resolveStatValue(value);
    }
  }

  // Resolve ranked buffSpec
  if (effect.buffSpec) {
    effect.buffSpec = { ...effect.buffSpec };

    for (const [statId, spec] of Object.entries(effect.buffSpec)) {
      const resolvedSpec = { ...spec };
      effect.buffSpec[statId] = resolvedSpec;

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
          category: `${sourceId}:effect${effectIndex}`,
          actionIndex: index,
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

export const normalizeEffects = (gameId, member, spec) => {
  const { memberIds, teamActions } = spec;
  const { id: memberId, rank: memberRank, weaponId, weaponRank, setCounts, mainEcho } = member;
  const character = CHARACTER[gameId][memberId];
  const weapon = WEAPON[gameId][weaponId];

  const toNormalize = [
    {
      from: 'character',
      id: memberId,
      rawEffects: character.effects,
    },
    {
      from: 'weapon',
      id: weaponId,
      rawEffects: weapon.effects,
    },
    ...Object.entries(setCounts).map(([setId, count]) => ({
      from: 'set',
      id: setId,
      rawEffects: Object.entries(SET[gameId][setId].bonusEffects)
        .filter(([tier]) => Number(tier) <= count)
        .flatMap(([, effects]) => effects),
    })),
  ];

  if (mainEcho) {
    toNormalize.push({
      from: 'echo',
      id: mainEcho,
      rawEffects: ECHO[mainEcho].effects,
    });
  }

  const normalized = {};

  for (const { from, id, rawEffects } of toNormalize) {
    const spec = { from, rank: memberRank, character, weapon };

    for (const [index, rawEffect] of rawEffects.entries()) {
      if (!isEnabled(rawEffect, spec)) continue;

      const effect = toNormalizedEffect(rawEffect, {
        gameId,
        ownerId: memberId,
        sourceId: id,
        effectIndex: index,
        memberRank,
        weaponRank,
        memberIds,
        memberActions: teamActions[memberId],
      });

      normalized[effect.id] = effect;
    }
  }

  // Resolve tokens
  const hasEffectStacksMap = (field) =>
    /^[a-z]\w*IfEffectStacks[A-Z]\w*$/.test(field) ||
    /^on[A-Z]\w*Do[A-Z]\w*$/.test(field);

  const resolveEffectId = (key) =>
    key.includes(':')
      ? key
      : Object.values(normalized).find((effect) => effect.key === key).id;

  for (const effect of Object.values(normalized)) {
    const { maxStacks = 1 } = effect;

    for (const field in effect) {
      if (!hasEffectStacksMap(field)) continue;

      const resolved = {};

      for (const [key, stacks] of Object.entries(effect[field])) {
        resolved[resolveEffectId(key)] = stacks === '$maxStacks' ? maxStacks : stacks;
      }

      effect[field] = resolved;
    }
  }

  return normalized;
};
