import { CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  isEnabledChar,
  isEnabledWeap,
  isEnabledSet,
  isEnabledEcho,
  toArray,
} from '@/utils';
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

  if (effect.use?.action) {
    effect.use = { ...effect.use };
    const effectActions = toArray(effect.use.action);

    effect.use.action = [];
    for (const [index, rawlinkedAction] of effectActions.entries()) {
      if (typeof rawlinkedAction === 'string') { // ref
        effect.use.action.push(memberActions[rawlinkedAction]);
      } else { // inline action object
        effect.use.action.push(toNormalizedAction(rawlinkedAction, {
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
  const normalized = {};

  // Character effects
  const charData = CHARACTER[gameId][member.id];
  for (const [index, rawEffect] of charData.effects.entries()) {
    if (!isEnabledChar(rawEffect, member)) continue;

    const effect = toNormalizedEffect(rawEffect, {
      gameId,
      ownerId: member.id,
      sourceId: member.id,
      effectIndex: index,
      memberRank: member.rank,
      weaponRank: member.weaponRank,
      memberIds,
      memberActions: teamActions,
      memberMode: member.mode,
    });

    normalized[effect.id] = effect;
  }

  // Weapon effects
  const weapData = WEAPON[gameId][member.weaponId];
  const weapEffects = weapData.effects ?? [];
  for (const [index, rawEffect] of weapEffects.entries()) {
    if (charData.type !== weapData.type) continue;
    if (!isEnabledWeap(rawEffect, charData, weapData)) continue;

    const effect = toNormalizedEffect(rawEffect, {
      gameId,
      ownerId: member.id,
      sourceId: member.weaponId,
      effectIndex: index,
      memberRank: member.rank,
      weaponRank: member.weaponRank,
      memberIds,
      memberActions: teamActions,
      memberMode: member.mode,
    });

    normalized[effect.id] = effect;
  }

  // Set effects
  for (const [setId, pcCount] of Object.entries(member.setCounts)) {
    const setData = SET[gameId][setId];
    const setEffects = setData.effects ?? [];
    for (const [index, rawEffect] of setEffects.entries()) {
      if (!isEnabledSet(rawEffect, pcCount, charData)) continue;

      const effect = toNormalizedEffect(rawEffect, {
        gameId,
        ownerId: member.id,
        sourceId: setId,
        effectIndex: index,
        memberRank: member.rank,
        weaponRank: member.weaponRank,
        memberIds,
        memberActions: teamActions,
        memberMode: member.mode,
      });

      normalized[effect.id] = effect;
    }
  }

  // Echo effects
  const echoData = ECHO[member.mainEcho];
  const echoEffects = echoData?.effects ?? [];
  for (const [index, rawEffect] of echoEffects.entries()) {
    if (!isEnabledEcho(rawEffect, charData)) continue;

    const effect = toNormalizedEffect(rawEffect, {
      gameId,
      ownerId: member.id,
      sourceId: member.mainEcho,
      effectIndex: index,
      memberRank: member.rank,
      weaponRank: member.weaponRank,
      memberIds,
      memberActions: teamActions,
      memberMode: member.mode,
    });

    normalized[effect.id] = effect;
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
