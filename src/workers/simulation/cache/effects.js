import { CHARACTER, WEAPON, SET, ECHO } from '@/data';
import { toArray } from '@/utils';
import { createIsEnabled } from './isEnabled';
import { toNormalizedAction } from './actions';
import { resolveRankedValue } from './resolveRanked';

function toResolvedScope(ownerId, memberIds, rawScope) {
  switch (rawScope) {
    case undefined: return [ownerId];
    case '$team': return memberIds;
    case '$ally': return memberIds.filter((id) => id !== ownerId);
    case '$first': return [memberIds[0]];
    case '$next': return [memberIds.at(memberIds.indexOf(ownerId) - 1)];
    default: return toArray(rawScope);
  }
}

function mergeValues(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return [a, b];
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return [
      ...toArray(a),
      ...toArray(b),
    ];
  }

  if (
    a &&
    typeof a === 'object' &&
    b &&
    typeof b === 'object'
  ) {
    const merged = { ...a };

    for (const [key, value] of Object.entries(b)) {
      merged[key] =
        key in merged
          ? mergeValues(merged[key], value)
          : value;
    }

    return merged;
  }

  return b;
}

function resolveRankMods(effect, memberRank) {
  const { rankMods } = effect;

  for (const { rank, ...modSpec } of rankMods) {
    if (rank > memberRank) continue;

    for (const [field, add] of Object.entries(modSpec)) {
      effect[field] =
        field in effect
          ? mergeValues(effect[field], add)
          : add;
    }
  }
}

export const toNormalizedEffect = (rawEffect, spec) => {
  const {
    gameId, ownerId, sourceId, effectIndex,
    memberRank, weaponRank, memberIds, memberActions, memberMode,
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

  effect.stores = toResolvedScope(effect.ownerId, memberIds, effect.stores);

  if (effect.apply) {
    const resolved = { ...effect.apply };
    resolved.by = toResolvedScope(effect.ownerId, memberIds, resolved.by);
    effect.apply = resolved;
  }

  // Resolve ranked buffMaps
  if (effect.buff?.stats) {
    effect.buff = { ...effect.buff };
    effect.buff.stats = { ...effect.buff.stats };

    for (const [statId, value] of Object.entries(effect.buff.stats)) {
      effect.buff.stats[statId] = resolveStatValue(value);
    }
  }

  // Resolve ranked buffSpec
  if (effect.buff?.specs) {
    effect.buff = { ...effect.buff };
    effect.buff.specs = { ...effect.buff.specs };

    for (const [statId, spec] of Object.entries(effect.buff.specs)) {
      const resolvedSpec = { ...spec };
      effect.buff.specs[statId] = resolvedSpec;

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
          mode: memberMode,
        }));
      }
    }
  }

  if (effect.rankMods) {
    resolveRankMods(effect, memberRank);
  }

  return effect;
};

export const normalizeEffects = (gameId, member, spec) => {
  const { memberIds, teamActions } = spec;
  const {
    id: memberId, rank: memberRank,
    weaponId, weaponRank,
    setCounts, mainEcho,
  } = member;

  const ctx = {
    member,
    character: CHARACTER[gameId][memberId],
    weapon: WEAPON[gameId][weaponId],
    echo: ECHO[mainEcho],
  };

  const isEnabled = createIsEnabled(ctx);

  const toNormalize = [
    {
      sourceType: 'character',
      id: memberId,
      rawEffects: ctx.character.effects,
    },
    {
      sourceType: 'weapon',
      id: weaponId,
      rawEffects: ctx.weapon.effects,
    },
    ...Object.keys(setCounts).map((setId) => ({
      sourceType: 'set',
      id: setId,
      rawEffects: SET[gameId][setId].effects,
    })),
  ];

  if (ECHO[mainEcho]?.effects) {
    toNormalize.push({
      sourceType: 'echo',
      id: mainEcho,
      rawEffects: ECHO[mainEcho].effects,
    });
  }

  const normalized = {};

  for (const { sourceType, id, rawEffects } of toNormalize) {
    if (
      sourceType === 'weapon' &&
      ctx.character.type !== ctx.weapon.type
    ) continue;

    for (const [index, rawEffect] of rawEffects.entries()) {
      if (!isEnabled(rawEffect, id)) continue;

      const effect = toNormalizedEffect(rawEffect, {
        gameId,
        ownerId: memberId,
        sourceId: id,
        effectIndex: index,
        memberRank,
        weaponRank,
        memberIds,
        memberActions: teamActions[memberId],
        memberMode: member.mode,
      });

      normalized[effect.id] = effect;
    }
  }

  // Resolve tokens
  const resolveEffectId = (key, sourceId) =>
    key.includes(':')
      ? key
      : Object.values(normalized)
        .filter((effect) => effect.sourceId === sourceId)
        .find((effect) => effect.key === key).id;

  function walkBooleanTree(node, onLeaf) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('and' in node) {
      node.and.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('or' in node) {
      node.or.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('not' in node) {
      walkBooleanTree(node.not, onLeaf);
      return;
    }
    onLeaf(node);
  }

  function traverseFilter(node, sourceId) {
    walkBooleanTree(node, (leaf) => {
      if ('has' in leaf) return; // generic has (e.g. action.has) - not an effect reference

      const [key, value] = Object.entries(leaf)[0];
      if (key === 'effectStacks') {
        resolveEffectStacksKeys(value, sourceId);
        return;
      }
      traverseFilter(value, sourceId);
    });
  }

  function resolveEffectStacksKeys(value, sourceId) {
    walkBooleanTree(value, (leaf) => {
      if ('has' in leaf) {
        if (Array.isArray(leaf.has)) {
          leaf.has = leaf.has.map((key) => resolveEffectId(key, sourceId));
        } else if (leaf.has !== '*') {
          leaf.has = resolveEffectId(leaf.has, sourceId);
        }
        return;
      }

      // remaining keys are effect ids being compared (stacks thresholds etc.)
      for (const key of Object.keys(leaf)) {
        const comparison = leaf[key];
        delete leaf[key];
        leaf[resolveEffectId(key, sourceId)] = comparison;
      }
    });
  }

  for (const effect of Object.values(normalized)) {
    const { sourceId } = effect;

    for (const field in effect) {
      if (/^on[A-Z]\w*Do[A-Z]\w*$/.test(field)) {
        const resolved = {};
        for (const [key, stacks] of Object.entries(effect[field])) {
          const id = resolveEffectId(key, sourceId);
          resolved[id] = stacks;
        }
        effect[field] = resolved;
      }
    }

    if (effect.apply?.filter) {
      traverseFilter(effect.apply.filter, sourceId);
    }

    if (effect.remove?.filter) {
      traverseFilter(effect.remove.filter, sourceId);
    }

    if (effect.use?.filter) {
      traverseFilter(effect.use.filter, sourceId);
    }

    if (effect.buff?.filter) {
      traverseFilter(effect.buff.filter, sourceId);
    }
  }

  return normalized;
};
